import { Request, Response, NextFunction } from 'express';
import cloudinary from 'cloudinary';
import Product from '../models/productModel';
import SearchFeatures from '../utils/searchFeatures';
import ErrorHandler from '../utils/errorHandler';
import asyncErrorHandler from '../middlewares/helpers/asyncErrorHandler';

export const getAllProducts = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const resultPerPage = 12;
    const productsCount = await Product.countDocuments();

    const searchFeature = new SearchFeatures(Product.find(), req.query)
        .search()
        .filter();

    let products = await searchFeature.query;
    const filteredProductsCount = products.length;

    searchFeature.pagination(resultPerPage);
    products = await searchFeature.query.clone();

    res.status(200).json({ success: true, products, productsCount, resultPerPage, filteredProductsCount });
});

export const getProducts = asyncErrorHandler(async (_req: Request, res: Response) => {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
});

export const getProductDetails = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));
    res.status(200).json({ success: true, product });
});

export const getAdminProducts = asyncErrorHandler(async (_req: Request, res: Response) => {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
});

export const createProduct = asyncErrorHandler(async (req: any, res: Response) => {
    let images: string[] = [];
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    const imagesLink = await Promise.all(images.map(async (img: string) => {
        const result = await cloudinary.v2.uploader.upload(img, { folder: "products" });
        return { public_id: result.public_id, url: result.secure_url };
    }));

    const logoResult = await cloudinary.v2.uploader.upload(req.body.logo, { folder: "brands" });
    req.body.brand = { name: req.body.brandname, logo: { public_id: logoResult.public_id, url: logoResult.secure_url } };
    req.body.images = imagesLink;
    req.body.user = req.user.id;
    req.body.specifications = req.body.specifications.map((s: string) => JSON.parse(s));

    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
});

export const updateProduct = asyncErrorHandler(async (req: any, res: Response, next: NextFunction) => {
    let product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    if (req.body.images !== undefined) {
        let images: string[] = typeof req.body.images === "string" ? [req.body.images] : req.body.images;

        await Promise.all(product.images.map((img: any) => cloudinary.v2.uploader.destroy(img.public_id)));

        const imagesLink = await Promise.all(images.map(async (img: string) => {
            const result = await cloudinary.v2.uploader.upload(img, { folder: "products" });
            return { public_id: result.public_id, url: result.secure_url };
        }));
        req.body.images = imagesLink;
    }

    if (req.body.logo?.length > 0) {
        await cloudinary.v2.uploader.destroy(product.brand.logo.public_id);
        const result = await cloudinary.v2.uploader.upload(req.body.logo, { folder: "brands" });
        req.body.brand = { name: req.body.brandname, logo: { public_id: result.public_id, url: result.secure_url } };
    }

    req.body.specifications = req.body.specifications.map((s: string) => JSON.parse(s));
    req.body.user = req.user.id;

    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false });
    res.status(201).json({ success: true, product });
});

export const deleteProduct = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    await Promise.all(product.images.map((img: any) => cloudinary.v2.uploader.destroy(img.public_id)));
    await product.remove();

    res.status(201).json({ success: true });
});

export const createProductReview = asyncErrorHandler(async (req: any, res: Response, next: NextFunction) => {
    const { rating, comment, productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    const reviewIndex = product.reviews.findIndex((rev: any) => rev.user.toString() === req.user._id.toString());

    if (reviewIndex !== -1) {
        product.reviews[reviewIndex].rating = rating;
        product.reviews[reviewIndex].comment = comment;
    } else {
        product.reviews.push({ user: req.user._id, name: req.user.name, rating, comment });
    }

    product.numOfReviews = product.reviews.length;
    product.ratings = product.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / product.numOfReviews;

    await product.save({ validateBeforeSave: false });
    res.status(200).json({ success: true });
});

export const getProductReviews = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.query.id);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));
    res.status(200).json({ success: true, reviews: product.reviews });
});

export const deleteReview = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.query.productId);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    const reviews = product.reviews.filter((rev: any) => rev._id.toString() !== req.query.id?.toString());
    const ratings = reviews.length ? reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / reviews.length : 0;
    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, { reviews, ratings, numOfReviews }, { new: true, runValidators: true, useFindAndModify: false });
    res.status(200).json({ success: true });
});

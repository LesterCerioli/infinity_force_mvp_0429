import { Request, Response, NextFunction } from "express";
import ProductBrand from "../../models/ProductBrand";
import ProductImages from "../../models/ProductImages";
import Category from "../../models/Category";
import _ from "lodash";
import path from "path";
import fs from "fs";
import { districts } from "../common";

export const validateLead = (req: Request, res: Response, next: NextFunction) => {
    req.check("email", "Email must be between 3 to 32 characters")
        .matches(/.+\@.+\..+/)
        .withMessage("Invalid email")
        .isLength({ min: 4, max: 2000 });

    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

export const validateSignUp = (req: Request, res: Response, next: NextFunction) => {
    req.check("name", "Name is required").notEmpty();
    req.check("email", "Email must be between 3 to 32 characters")
        .matches(/.+\@.+\..+/)
        .withMessage("Invalid email")
        .isLength({ min: 4, max: 2000 });
    req.check("password", "Password is required").notEmpty();
    req.check("password")
        .isLength({ min: 6 })
        .withMessage("Password must contain at least 6 characters")
        .matches(/\d/)
        .withMessage("Password must contain a number");

    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

export const validateSocialLogin = (req: Request, res: Response, next: NextFunction) => {
    req.check("name", "Name is required.").notEmpty();
    req.check("email", "Email must be between 3 to 32 characters")
        .matches(/.+\@.+\..+/)
        .withMessage("Invalid email")
        .isLength({ min: 4, max: 2000 });
    req.check("userID", "userID is required.").notEmpty();
    req.check("socialPhoto", "Invalid photo url.")
        .notEmpty()
        .matches(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
    req.check("loginDomain", "Invalid login domian")
        .notEmpty()
        .isIn(["google", "facebook"]);

    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

const validatedispatcher = (req: Request) => {
    req.check("name", "Name is required").notEmpty();
    req.check("email", "Email must be between 3 to 32 characters")
        .matches(/.+\@.+\..+/)
        .withMessage("Invalid email")
        .isLength({ min: 4, max: 2000 });
    req.check("address", "Address is required").notEmpty();
    req.check("phone", "Phone is required").notEmpty();
};

export const validateDispatcher = (req: Request, res: Response, next: NextFunction) => {
    validatedispatcher(req);
    req.check("password", "Password is required").notEmpty();
    req.check("password")
        .isLength({ min: 6 })
        .withMessage("Password must contain at least 6 characters")
        .matches(/\d/)
        .withMessage("Password must contain a number");

    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

export const validateUpdateDispatcher = (req: Request, res: Response, next: NextFunction) => {
    validatedispatcher(req);
    if (req.body.newPassword) {
        req.check("newPassword")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 chars long")
            .matches(/\d/)
            .withMessage("Password must contain a number");
    }

    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

export const passwordResetValidator = (req: Request, res: Response, next: NextFunction) => {
    req.check("newPassword", "Password is required").notEmpty();
    req.check("newPassword")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 chars long")
        .matches(/\d/)
        .withMessage("Password must contain a number");

    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

export const validateBusinessInfo = (req: Request, res: Response, next: NextFunction) => {
    req.check("ownerName", "Owner name is required").notEmpty();
    req.check("address", "Address is required").notEmpty();
    req.check("city", "City is required").notEmpty();
    req.check("citizenshipNumber", "Citizenship number is required").notEmpty();
    req.check("businessRegisterNumber", "Business register number is required").notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

export const validateAdminBankInfo = (req: Request, res: Response, next: NextFunction) => {
    req.check("accountHolder", "Account holder name is required").notEmpty();
    req.check("bankName", "Bank name is required").notEmpty();
    req.check("branchName", "Branch name is required").notEmpty();
    req.check("accountNumber", "Account number is required").notEmpty();
    req.check("routingNumber", "Bank number is required").notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

export const validateWareHouse = (req: Request, res: Response, next: NextFunction) => {
    req.check("name", "Warehouse name is required").notEmpty();
    req.check("address", "Warehouse address is required").notEmpty();
    req.check("phoneno", "Warehouse phone number is required").notEmpty();
    req.check("city", "City of warehouse is required").notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

export const validateAdminProfile = (req: Request, res: Response, next: NextFunction) => {
    req.check("shopName", "Shop name is required").notEmpty();
    req.check("address", "Address is required").notEmpty();
    req.check("phone", "Phone number is required").notEmpty();
    req.check("muncipality", "Muncipality is required").notEmpty();
    req.check("district", "District is required").notEmpty();
    req.check("wardno", "Ward number is required").notEmpty();

    if (req.body.newPassword) {
        req.check("newPassword")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 chars long")
            .matches(/\d/)
            .withMessage("Password must contain a number");
    }

    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

export const validateProduct = async (req: Request, res: Response, next: NextFunction) => {
    req.check("name", "Product name is required").notEmpty();
    req.check("price", "Selling price of product is required").notEmpty();
    req.check("quantity", "Product quantity is required").notEmpty();
    req.check("return", "Product returning time period is required").notEmpty();
    req.check("description", "Product description is required").notEmpty();
    req.check("warranty", "Product warranty is required").notEmpty();
    req.check("brand", "Product brand is required").notEmpty();
    req.check("availableDistricts", "Invalid districts.").custom((values: any) => {
        const dts = values ? (typeof values === "string" ? [values] : values) : [];
        return values ? _.intersection(districts, dts).length === dts.length : true;
    });

    const errors: { msg: string }[] = req.validationErrors() || [];

    
    let imageDocs = [];
    try {
        const imageIds = typeof req.body.images === "string" ? [req.body.images] : req.body.images || [];
        imageDocs = await ProductImages.find().where("_id").in(imageIds);
        if (imageDocs.length !== imageIds.length) {
            errors.push({ msg: "Invalid image ids" });
        }
        (req as any).images = imageDocs;
    } catch (err) {
        errors.push({ msg: "Invalid image ids" });
    }

    
    const brand = await ProductBrand.findOne({ slug: req.body.brand });
    if (!brand) {
        errors.push({ msg: "Invalid product brand" });
    } else {
        req.body.brand = brand._id;
    }
    
    const categories = await Category.find({ slug: req.body.category });
    if (!categories.length) {
        errors.push({ msg: "Invalid product category" });
    } else if (categories.some(cat => cat.isDisabled)) {
        errors.push({ msg: "Categories have been disabled" });
    } else {
        req.body.category = categories.map(cat => cat._id);
    }

    if (errors.length) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }

    next();
};

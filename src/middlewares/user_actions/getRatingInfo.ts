import Review from "@/models/review";


interface ReviewStar {
  star: number;
}

interface Product {
  _id: string;
}

interface RatingData {
  fiveStars: number;
  fourStars: number;
  threeStars: number;
  twoStars: number;
  oneStars: number;
  averageStar: number;
  totalRatingUsers: number;
}

export default async function calculateRatings(product: Product, newStar: number): Promise<RatingData> {
  const stars: ReviewStar[] = await Review.find({ product: product._id }).select('star');

  let fiveStars = 0, fourStars = 0, threeStars = 0, twoStars = 0, oneStars = 0;

  stars.forEach(s => {
    switch (s.star) {
      case 5:
        fiveStars += 1;
        break;
      case 4:
        fourStars += 1;
        break;
      case 3:
        threeStars += 1;
        break;
      case 2:
        twoStars += 1;
        break;
      case 1:
        oneStars += 1;
        break;
    }
  });

  
  switch (newStar) {
    case 5:
      fiveStars += 1;
      break;
    case 4:
      fourStars += 1;
      break;
    case 3:
      threeStars += 1;
      break;
    case 2:
      twoStars += 1;
      break;
    case 1:
      oneStars += 1;
      break;
  }

  const totalRatingUsers = fiveStars + fourStars + threeStars + twoStars + oneStars;
  const averageStar = (5 * fiveStars + 4 * fourStars + 3 * threeStars + 2 * twoStars + oneStars) / totalRatingUsers;

  return {
    fiveStars,
    fourStars,
    threeStars,
    twoStars,
    oneStars,
    averageStar,
    totalRatingUsers,
  };
}

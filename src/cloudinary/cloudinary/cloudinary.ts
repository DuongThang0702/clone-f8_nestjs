import { v2 as cloudinary } from 'cloudinary';
import { Services } from 'src/utils/contants';

export const CloudinaryProvider = {
  provide: Services.CLOUDINARY_SERVICE,
  useFactory: () => {
    return cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRE,
    });
  },
};

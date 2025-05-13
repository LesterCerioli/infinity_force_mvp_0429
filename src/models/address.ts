import mongoose, { Schema, Document, Model } from 'mongoose';


interface IPoint {
  type: 'Point';
  coordinates: [number, number];
}

interface IAddress extends Document {
  user: mongoose.Types.ObjectId;
  label: 'home' | 'office' | 'other';
  region?: string;
  city?: string;
  area?: string;
  address?: string;
  geolocation?: IPoint;
  phoneno?: string;
  isActive?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}


const pointSchema = new Schema<IPoint>({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true,
    validate: {
      validator: (coords: number[]) => coords.length === 2,
      message: 'Coordinates must be an array of [longitude, latitude]'
    }
  }
});


const addressSchema = new Schema<IAddress>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  label: {
    type: String,
    trim: true,
    enum: ['home', 'office', 'other'],
    required: true
  },
  region: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  area: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  geolocation: {
    type: pointSchema,
    index: '2dsphere'
  },
  phoneno: {
    type: String,
    trim: true,
    maxlength: 10,
    validate: {
      validator: (v: string) => /^\d{10}$/.test(v),
      message: 'Phone number must be 10 digits'
    }
  },
  isActive: {
    type: Date,
    default: null
  }
}, { timestamps: true });


addressSchema.index({ geolocation: '2dsphere' });


const Address: Model<IAddress> = mongoose.model<IAddress>('Address', addressSchema);

export default Address;
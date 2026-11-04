import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import contactUsRoutes from './routes/contactUsRoutes.js';
import contactPageRoutes from './routes/contactPageRoutes.js';
import homeHeadRoutes from './routes/homeHeadRoutes.js';
import needHeroRoutes from './routes/needHeroRoutes.js';
import needContentRoutes from './routes/needContentRoutes.js';
import serviceHeroRoutes from './routes/serviceHeroRoutes.js';
import joinUsRoutes from './routes/joinUsRoutes.js';
import companyGalleryRoutes from './routes/companyGalleryRoutes.js';
import regionalProductRoutes from './routes/regionalProductRoutes.js';
import programRoutes from './routes/programRoutes.js';
import homeServeRoutes from './routes/homeServeRoutes.js';
import homeServiceRoutes from './routes/homeServiceRoutes.js';
import getKnowSolarRoutes from './routes/getKnowSolarRoutes.js';
import solutionHeroRoutes from './routes/solutionHeroRoutes.js';
import solarLightProductRoutes from './routes/solarLightProductRoutes.js';
import solarPanelProductRoutes from './routes/solarPanelProductRoutes.js';

import installationActionRoutes from './routes/installationActionRoutes.js';
import jobApplicationRoutes from './routes/jobApplicationRoutes.js';
import ourTechnologyRoutes from './routes/ourTechnologyRoutes.js';
import jobPageRoutes from './routes/jobPageRoutes.js';
import productInquiryRoutes from './routes/productInquiryRoutes.js';
import productBookingRoutes from './routes/productBookingRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';



// Environment variables loaded above
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contact', contactUsRoutes);
app.use('/api/contactpage', contactPageRoutes);
app.use('/api/homehead', homeHeadRoutes);
app.use('/api/needhero', needHeroRoutes);
app.use('/api/needcontent', needContentRoutes);
app.use('/api/servicehero', serviceHeroRoutes);
app.use('/api/joinus', joinUsRoutes);
app.use('/api/companygallery', companyGalleryRoutes);
app.use('/api/regionalproduct', regionalProductRoutes);
app.use('/api/program', programRoutes);
app.use('/api/homeserve', homeServeRoutes);
app.use('/api/home/service', homeServiceRoutes);
app.use('/api/getknowsolar', getKnowSolarRoutes);
app.use('/api/solutionhero', solutionHeroRoutes);
app.use('/api/solarlightproduct', solarLightProductRoutes);
app.use('/api/solarpanelproduct', solarPanelProductRoutes);
app.use('/api/installationaction', installationActionRoutes);
app.use('/api/jobapplication', jobApplicationRoutes);
app.use('/api/ourtechnology', ourTechnologyRoutes);
app.use('/api/jobpage', jobPageRoutes);
app.use('/api/product-inquiries', productInquiryRoutes);
app.use('/api/products/inquiries', productInquiryRoutes);
app.use('/api/product-bookings', productBookingRoutes);
app.use('/api/products/bookings', productBookingRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

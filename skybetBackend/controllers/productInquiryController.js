import ProductInquiry from '../models/ProductInquiry.js';
import Product from '../models/Product.js';

// 1. Create a new product inquiry (User submits inquiry on a product)
export const createInquiry = async (req, res) => {
  try {
    const {
      product,
      productId,
      name,
      email,
      phone,
      message,
      quantity,
      userId,
    } = req.body;

    const targetProductId = productId || product || req.params.productId;

    if (!targetProductId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Verify product exists
    const existingProduct = await Product.findById(targetProductId);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Determine user ID (from auth token or body)
    const targetUserId = req.user?._id || userId || null;
    const userEmail = email || req.user?.email || '';

    const inquiry = await ProductInquiry.create({
      product: targetProductId,
      user: targetUserId,
      name,
      email: userEmail,
      phone,
      message,
      quantity: quantity || 1,
    });

    const populatedInquiry = await ProductInquiry.findById(inquiry._id)
      .populate('product')
      .populate('user', 'email role');

    res.status(201).json({
      message: 'Product inquiry submitted successfully',
      inquiry: populatedInquiry,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get all inquiries (Admin: views all product inquiries)
export const getAllInquiries = async (req, res) => {
  try {
    const { status, product } = req.query;
    const query = {};

    if (status) query.status = status;
    if (product) query.product = product;

    const inquiries = await ProductInquiry.find(query)
      .populate('product')
      .populate('user', 'email role')
      .sort({ createdAt: -1 });

    res.json({
      count: inquiries.length,
      inquiries,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Get user's own inquiries (User: views only their own product inquiries)
export const getMyInquiries = async (req, res) => {
  try {
    const targetUserId = req.user?._id || req.query.userId || req.params.userId;

    if (!targetUserId) {
      return res.status(400).json({ message: 'User ID is required to fetch inquiries' });
    }

    const inquiries = await ProductInquiry.find({ user: targetUserId })
      .populate('product')
      .populate('user', 'email role')
      .sort({ createdAt: -1 });

    res.json({
      count: inquiries.length,
      inquiries,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Get inquiry by ID
export const getInquiryById = async (req, res) => {
  try {
    const inquiry = await ProductInquiry.findById(req.params.id)
      .populate('product')
      .populate('user', 'email role');

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    // If user is not admin, check if they own this inquiry
    if (
      req.user &&
      req.user.role !== 'admin' &&
      inquiry.user &&
      inquiry.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied: You do not have permission to view this inquiry' });
    }

    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Update inquiry status (Admin)
export const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'contacted', 'completed', 'cancelled'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Status must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    const inquiry = await ProductInquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('product')
      .populate('user', 'email role');

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    res.json({
      message: 'Inquiry status updated successfully',
      inquiry,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Delete inquiry (Admin)
export const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await ProductInquiry.findByIdAndDelete(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    res.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


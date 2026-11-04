import ProductBooking from '../models/ProductBooking.js';
import Product from '../models/Product.js';

// 1. Create a new product booking (User books a product with shipping address)
export const createBooking = async (req, res) => {
  try {
    const {
      product,
      productId,
      customerName,
      name,
      phone,
      email,
      shippingAddress,
      address,
      street,
      city,
      state,
      postalCode,
      pincode,
      country,
      quantity,
      totalAmount,
      paymentMethod,
      notes,
      userId,
    } = req.body;

    const targetProductId = productId || product || req.params.productId;
    if (!targetProductId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Check if product exists
    const existingProduct = await Product.findById(targetProductId);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const resolvedCustomerName = customerName || name;
    if (!resolvedCustomerName) {
      return res.status(400).json({ message: 'Customer name is required' });
    }

    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Format shipping address from object or flat fields
    let formattedAddress = {};
    if (shippingAddress && typeof shippingAddress === 'object') {
      formattedAddress = {
        fullAddress:
          shippingAddress.fullAddress ||
          `${shippingAddress.street || ''}, ${shippingAddress.city || ''}, ${shippingAddress.state || ''} ${shippingAddress.postalCode || ''}`.trim(),
        street: shippingAddress.street || '',
        city: shippingAddress.city || '',
        state: shippingAddress.state || '',
        postalCode: shippingAddress.postalCode || shippingAddress.pincode || '',
        country: shippingAddress.country || 'India',
      };
    } else {
      const fullAddr = address || [street, city, state, postalCode || pincode].filter(Boolean).join(', ');
      formattedAddress = {
        fullAddress: fullAddr,
        street: street || address || '',
        city: city || '',
        state: state || '',
        postalCode: postalCode || pincode || '',
        country: country || 'India',
      };
    }

    if (!formattedAddress.fullAddress && !formattedAddress.street && !formattedAddress.city) {
      return res.status(400).json({ message: 'Shipping address (street, city, etc.) is required' });
    }

    // Determine user ID (from token if logged in, or body)
    const targetUserId = req.user?._id || userId || null;
    const userEmail = email || req.user?.email || '';

    // Calculate pricing accurately
    const finalQuantity = quantity && Number(quantity) > 0 ? Number(quantity) : 1;
    const unitPrice =
      existingProduct.price !== undefined && existingProduct.price !== null
        ? Number(existingProduct.price)
        : 0;
    const finalTotal =
      totalAmount !== undefined && totalAmount !== null && Number(totalAmount) > 0
        ? Number(totalAmount)
        : unitPrice * finalQuantity;

    const booking = await ProductBooking.create({
      product: targetProductId,
      user: targetUserId,
      customerName: resolvedCustomerName,
      phone,
      email: userEmail,
      shippingAddress: formattedAddress,
      quantity: finalQuantity,
      unitPrice,
      totalAmount: finalTotal,
      paymentMethod: paymentMethod || 'cod',
      notes,
    });

    const populatedBooking = await ProductBooking.findById(booking._id)
      .populate('product')
      .populate('user', 'email role');

    res.status(201).json({
      message: 'Product booked successfully',
      booking: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get all bookings (Admin: views all bookings from all users)
export const getAllBookings = async (req, res) => {
  try {
    const { status, product, paymentStatus } = req.query;
    const query = {};

    if (status) query.status = status;
    if (product) query.product = product;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const bookings = await ProductBooking.find(query)
      .populate('product')
      .populate('user', 'email role')
      .sort({ createdAt: -1 });

    const formattedBookings = bookings.map((b) => {
      const obj = b.toObject();
      const productPrice = obj.product?.price ? Number(obj.product.price) : 0;
      if (!obj.unitPrice && productPrice) {
        obj.unitPrice = productPrice;
      }
      if ((!obj.totalAmount || obj.totalAmount === 0) && (obj.unitPrice || productPrice)) {
        obj.totalAmount = (obj.unitPrice || productPrice) * (obj.quantity || 1);
      }
      return obj;
    });

    res.json({
      count: formattedBookings.length,
      bookings: formattedBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Get user's own bookings (User: views only their booked products and status)
export const getMyBookings = async (req, res) => {
  try {
    const targetUserId = req.user?._id || req.query.userId || req.params.userId;

    if (!targetUserId) {
      return res.status(400).json({ message: 'User ID is required to fetch bookings' });
    }

    const bookings = await ProductBooking.find({ user: targetUserId })
      .populate('product')
      .populate('user', 'email role')
      .sort({ createdAt: -1 });

    const formattedBookings = bookings.map((b) => {
      const obj = b.toObject();
      const productPrice = obj.product?.price ? Number(obj.product.price) : 0;
      if (!obj.unitPrice && productPrice) {
        obj.unitPrice = productPrice;
      }
      if ((!obj.totalAmount || obj.totalAmount === 0) && (obj.unitPrice || productPrice)) {
        obj.totalAmount = (obj.unitPrice || productPrice) * (obj.quantity || 1);
      }
      return obj;
    });

    res.json({
      count: formattedBookings.length,
      bookings: formattedBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await ProductBooking.findById(req.params.id)
      .populate('product')
      .populate('user', 'email role');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // If user is not admin, ensure they own the booking
    if (
      req.user &&
      req.user.role !== 'admin' &&
      booking.user &&
      booking.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied: You do not have permission to view this booking' });
    }

    const obj = booking.toObject();
    const productPrice = obj.product?.price ? Number(obj.product.price) : 0;
    if (!obj.unitPrice && productPrice) {
      obj.unitPrice = productPrice;
    }
    if ((!obj.totalAmount || obj.totalAmount === 0) && (obj.unitPrice || productPrice)) {
      obj.totalAmount = (obj.unitPrice || productPrice) * (obj.quantity || 1);
    }

    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Update booking status (Admin: e.g., confirmed, shipped, delivered, cancelled)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const allowedStatuses = [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
    ];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Status must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const booking = await ProductBooking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
      .populate('product')
      .populate('user', 'email role');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({
      message: 'Booking status updated successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Cancel booking (User or Admin)
export const cancelBooking = async (req, res) => {
  try {
    const booking = await ProductBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Non-admin can only cancel their own booking
    if (
      req.user &&
      req.user.role !== 'admin' &&
      booking.user &&
      booking.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (['shipped', 'delivered'].includes(booking.status)) {
      return res.status(400).json({
        message: `Cannot cancel a booking that has already been ${booking.status}`,
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    const updatedBooking = await ProductBooking.findById(booking._id)
      .populate('product')
      .populate('user', 'email role');

    res.json({
      message: 'Booking cancelled successfully',
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 7. Delete booking (Admin)
export const deleteBooking = async (req, res) => {
  try {
    const booking = await ProductBooking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


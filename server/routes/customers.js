const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const { protect: auth } = require('../middlewares/authMiddleware');

// @route   GET /api/customers
// @desc    Get all customers with optional search
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};
    if (search) {
      query = { $text: { $search: search } };
    }

    const customers = await Customer.find(query)
      .sort({ createdAt: -1 })
      .lean();

    res.json(customers);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/customers
// @desc    Create a new customer
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    // Validate corporate/individual fields based on customerType
    if (req.body.customerType === 'Individual') {
      if (!req.body.fullName || !req.body.emiratesId || !req.body.nationality || !req.body.dob || !req.body.gender) {
        return res.status(400).json({ message: 'Missing required fields for individual customer' });
      }
    } else if (req.body.customerType === 'Corporate') {
      if (!req.body.companyName || !req.body.tradeLicense || !req.body.trnNumber) {
        return res.status(400).json({ message: 'Missing required fields for corporate customer' });
      }
    }

    const customer = new Customer(req.body);
    await customer.save();

    res.status(201).json(customer);
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    } else if (err.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/customers/:id
// @desc    Update a customer
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate corporate/individual fields based on customerType
    if (req.body.customerType === 'Individual') {
      if (!req.body.fullName || !req.body.emiratesId || !req.body.nationality || !req.body.dob || !req.body.gender) {
        return res.status(400).json({ message: 'Missing required fields for individual customer' });
      }
    } else if (req.body.customerType === 'Corporate') {
      if (!req.body.companyName || !req.body.tradeLicense || !req.body.trnNumber) {
        return res.status(400).json({ message: 'Missing required fields for corporate customer' });
      }
    }

    const customer = await Customer.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    } else if (err.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/customers/:id
// @desc    Delete a customer
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ message: 'Customer removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/customers/stats
// @desc    Get customer statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await Customer.aggregate([
      {
        $facet: {
          totalCustomers: [{ $count: "count" }],
          customerTypes: [
            { $group: { _id: "$customerType", count: { $sum: 1 } } }
          ],
          kycStatus: [
            { $group: { _id: "$kycVerified", count: { $sum: 1 } } }
          ],
          byEmirate: [
            { $group: { _id: "$emirate", count: { $sum: 1 } } }
          ],
          recentCustomers: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            { $project: { 
              _id: 1, 
              name: { $ifNull: ["$fullName", "$companyName"] },
              customerType: 1,
              createdAt: 1 
            } }
          ]
        }
      }
    ]);

    res.json(stats[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
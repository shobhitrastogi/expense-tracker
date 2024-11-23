const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');

router.post('/', auth, async (req, res) => {
    const { amount, description, category, date } = req.body;
    try {
        const expense = new Expense({ amount, description, category, date, user: req.user._id });
        await expense.save();
        res.status(201).send({ message: 'Expense created successfully', expense });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});  
router.get('/', auth, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user._id });
        res.status(200).send(expenses);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}); 
router.put('/:id', auth, async (req, res) => {
    const { amount, description, category, date } = req.body;
    try {
        const expense = await Expense.findByIdAndUpdate(req.params.id, { amount, description, category, date }, { new: true });
        if (!expense) return res.status(404).send({ message: 'Expense not found' });
        if (expense.user.toString() !== req.user._id.toString()) return res.status(403).send({ message: 'Unauthorized' });
        expense.amount = amount;
        expense.description = description;
        expense.category = category;
        expense.date = date;
        await expense.save();
        res.status(200).send({ message: 'Expense updated successfully', expense });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
    });   
router.delete('/:id', auth, async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);
        if (!expense) return res.status(404).send({ message: 'Expense not found' });
        if (expense.user.toString() !== req.user._id.toString()) return res.status(403).send({ message: 'Unauthorized' });
        await expense.remove();
        res.status(200).send({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});    
module.exports = router;    
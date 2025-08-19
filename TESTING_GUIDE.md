# Golden Dragon Restaurant - Testing Guide

This guide will walk you through testing all features of the Golden Dragon Restaurant website step by step.

## 🌐 Access the Website

1. **Local Development**: http://localhost:3003
2. **Production**: https://d210zmtcb802hw.amplifyapp.com

## 📅 Step 1: Making a Reservation

### Navigate to Reservation Page
1. Click on **"Reservation"** in the navigation menu
2. Or go directly to: http://localhost:3003/reservation

### Fill Out the Reservation Form
1. **Name**: Enter your full name (e.g., "John Smith")
2. **Email**: Enter a valid email (e.g., "john@example.com")
3. **Phone**: Enter phone number (e.g., "555-1234")
4. **Date**: Select a date (must be today or future)
5. **Time**: Choose from available time slots (11:00 AM - 9:00 PM)
6. **Number of Guests**: Select 1-20 guests
7. **Special Requests** (Optional): Add any dietary restrictions or special occasions

### Submit Reservation
1. Click the **"Submit Reservation"** button
2. You should see: "Reservation submitted successfully! We will contact you soon to confirm."
3. The form will reset for a new reservation

### Verify in Host Dashboard
1. Go to: http://localhost:3003/admin/host
2. Check the **Reservations** tab
3. Your reservation should appear with status "pending"
4. Host can click **"Confirm"** or **"Cancel"** to manage the reservation

## 🛒 Step 2: Placing a Delivery Order

### Navigate to Delivery Page
1. Click on **"Delivery"** in the navigation menu
2. Or go directly to: http://localhost:3003/delivery

### Browse and Add Items to Cart
1. **Filter by Category**: Use category buttons (Appetizers, Soups, Poultry, etc.)
2. **Add Items**: Click **"Add to Cart"** on desired items
   - Try adding:
     - Spring Rolls ($6.99)
     - Kung Pao Chicken ($12.99)
     - Fried Rice ($9.99)
3. **View Cart**: Click the cart icon in bottom-right corner
4. **Adjust Quantities**: Use + and - buttons in the cart
5. **Remove Items**: Click "Remove" if needed

### Proceed to Checkout
1. Click **"Proceed to Checkout"** in the cart
2. You'll be redirected to the checkout page

### Complete Checkout Form
1. **Customer Information**:
   - Name: "Jane Doe"
   - Email: "jane@example.com"
   - Phone: "555-5678"
2. **Delivery Information**:
   - Address: "123 Main Street, Apt 4B, New York, NY 10001"
3. **Payment**: Select "Cash on Delivery" or "Credit Card"
4. **Special Instructions** (Optional): "Please ring doorbell twice"
5. Click **"Place Order"**

### Order Confirmation
1. You should see: "Order placed successfully!"
2. Note your order ID for tracking

### Verify in Host Dashboard
1. Go to: http://localhost:3003/admin/host
2. Check the **Orders** tab
3. Your order should appear with:
   - Customer details
   - Order items
   - Total amount
   - Status (can be updated by host)

## 👤 Step 3: Creating a Membership

### Navigate to Sign Up Page
1. Click **"Sign Up"** button in the navigation menu
2. Or go directly to: http://localhost:3003/signup

### Fill Out Registration Form
1. **Name**: Enter your full name (e.g., "Mike Johnson")
2. **Email**: Enter a valid email (e.g., "mike@example.com")
3. **Password**: Create a strong password (min 8 characters)
4. **Confirm Password**: Re-enter the same password
5. Click **"Sign Up"**

### Email Verification
1. Check your email for verification code
2. Enter the 6-digit code on the verification page
3. Click **"Verify Email"**

### Complete Profile (Optional)
1. After verification, you can add:
   - Phone number
   - Delivery address
   - Dietary preferences

### Login to Your Account
1. Click **"Login"** in navigation
2. Enter your email and password
3. Click **"Sign In"**

### Member Benefits
Once logged in, you can:
- View order history
- Save favorite items
- Earn loyalty points
- Get member-only discounts
- Quick checkout with saved information

### Verify in Host Dashboard
1. Go to: http://localhost:3003/admin/host
2. Check the **Members** tab
3. New member should appear with:
   - Email
   - Registration date
   - Total orders (starts at 0)
   - Loyalty points (starts at 0)

## 🎯 Step 4: Testing Host Dashboard Features

### Access Host Dashboard
1. Login with host credentials
2. Go to: http://localhost:3003/admin/host

### Dashboard Overview
- **Today's Reservations**: Count of reservations for today
- **Active Orders**: Orders pending delivery
- **Total Members**: Registered users count
- **Today's Revenue**: Sum of today's completed orders

### Managing Reservations
1. Click **Reservations** tab
2. View all reservations with details
3. **Actions**:
   - Click **"Confirm"** to approve reservation
   - Click **"Cancel"** to reject reservation
   - View special requests and contact info

### Managing Orders
1. Click **Orders** tab
2. View all delivery orders
3. **Update Status**:
   - Pending → Confirmed
   - Confirmed → Preparing
   - Preparing → Delivering
   - Delivering → Delivered
4. View order details and special instructions

### Member Management
1. Click **Members** tab
2. View all registered users
3. See member statistics:
   - Total orders placed
   - Total amount spent
   - Loyalty points earned
   - Member since date

## 🧪 Test Data Examples

### Sample Reservation Data
```javascript
{
  customerName: "Test Customer",
  email: "test@example.com",
  phone: "555-0100",
  date: "2025-01-25",
  time: "18:30",
  numberOfGuests: 4,
  specialRequests: "Window seat, celebrating anniversary"
}
```

### Sample Order Data
```javascript
{
  customerName: "Test Buyer",
  email: "buyer@example.com",
  phone: "555-0200",
  deliveryAddress: "456 Oak Street, Suite 10",
  items: [
    { name: "Kung Pao Chicken", quantity: 2, price: 12.99 },
    { name: "Fried Rice", quantity: 1, price: 9.99 }
  ],
  subtotal: 35.97,
  tax: 3.60,
  deliveryFee: 3.00,
  total: 42.57,
  specialInstructions: "Extra spicy, no MSG"
}
```

### Sample Member Data
```javascript
{
  name: "Regular Customer",
  email: "regular@example.com",
  phoneNumber: "555-0300",
  role: "customer",
  totalOrders: 10,
  totalSpent: 250.00,
  loyaltyPoints: 250
}
```

## 🔍 Troubleshooting

### If Reservation Doesn't Submit
1. Check all required fields are filled
2. Ensure date is not in the past
3. Check browser console for errors
4. Verify Amplify is configured correctly

### If Cart is Empty After Adding Items
1. Check localStorage is enabled
2. Refresh the page
3. Try a different browser
4. Clear browser cache

### If Login Fails
1. Verify email is registered
2. Check password is correct
3. Complete email verification if pending
4. Try password reset if forgotten

### If Dashboard Shows No Data
1. Ensure you're logged in as host
2. Check GraphQL API is accessible
3. Verify data permissions in Amplify
4. Check browser console for errors

## 📊 Monitoring Data Flow

### Check GraphQL API
1. Open browser DevTools (F12)
2. Go to Network tab
3. Filter by "graphql"
4. Perform actions (create reservation, place order)
5. Inspect request/response payloads

### View Console Logs
1. Open browser console
2. Look for:
   - "Creating reservation with data:"
   - "Order submission data:"
   - "Fetching reservations..."
   - Any error messages

### Database Verification
1. AWS Console → DynamoDB
2. Check tables:
   - Reservation table
   - Order table
   - User table
3. Verify data is being saved correctly

## ✅ Success Criteria

- [ ] Can create a reservation without errors
- [ ] Reservation appears in host dashboard
- [ ] Can add items to cart and checkout
- [ ] Order appears in host dashboard with correct total
- [ ] Can create a new user account
- [ ] Can login with created account
- [ ] Member appears in host dashboard
- [ ] All dashboard statistics update correctly
- [ ] Real-time updates work (subscriptions)
- [ ] Status changes persist in database

## 🚀 Next Steps

After testing locally:
1. Push changes to GitHub
2. Wait for Amplify deployment
3. Test on production URL
4. Monitor CloudWatch logs for errors
5. Set up monitoring alerts
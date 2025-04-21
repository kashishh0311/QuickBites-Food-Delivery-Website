# 🍣 QuickBites - Food Delivery Website

**QuickBites** is a lively full-stack food delivery platform serving up chef-crafted meals with a side of convenience. 🍝 Dive into our menu, order with ease, and track your delivery in a vibrant orange-and-gray interface that’s as tasty as our food. 🥐

## 🌟 Key Features

- 🍴 **Handcrafted Menu**: Explore dishes made fresh by our culinary team.
- 🔒 **Safe Sign-Up & Login**: Secure access for a tailored experience.
- 📋 **Menu Discovery**: Browse with filters and fun food emojis (🍝🥐🍣).
- 🛒 **Flexible Cart**: Add or tweak items effortlessly.
- 💸 **Smooth Payments**: Quick and secure checkout.
- 📍 **Live Order Updates**: Track from prep to delivery, plus view past orders.
- 📝 **Feedback Option**: Share thoughts on delivered orders to shape our menu.
- 🖥️ **Dedicated Panels**:
  - **Client_Frontend**: Your hub for ordering and tracking.
  - **Restaurant_Frontend**: Our team’s tool for menu and order management.
  - **Admin_Frontend**: Oversight for orders, feedback, and platform ops.
- 📱 **All-Device Design**: Looks great on mobile, tablet, or desktop.

## 🧰 Built With

- **Frontend**: React.js, Tailwind CSS, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT-based

## 🔧 Setup Steps

1. **Clone the Project**

   ```bash
   https://github.com/kashishh0311/QuickBites-Food-Ordering-Website.git
   cd quickbites
   ```

2. **Install Dependencies**  
   Backend:

   ```bash
   cd Backend
   npm install
   ```

   Client frontend:

   ```bash
   cd ../Client_Frontend
   npm install
   ```

   Restaurant frontend:

   ```bash
   cd ../Restaurant_Frontend
   npm install
   ```

   Admin frontend:

   ```bash
   cd ../Admin_Frontend
   npm install
   ```

3. **Set Up Environment**  
   In `Backend`, create a `.env` file:

   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

   In `Client_Frontend`, `Restaurant_Frontend`, and `Admin_Frontend`, create a `.env` file:

   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Configure MongoDB**

   - Use MongoDB Atlas or a local MongoDB instance.
   - Add your connection string to `MONGO_URI` in `Backend/.env`.

5. **Start the Platform**  
   Backend:
   ```bash
   cd Backend
   npm run dev
   ```
   Client frontend:
   ```bash
   cd Client_Frontend
   npm run dev
   ```
   Restaurant frontend:
   ```bash
   cd Restaurant_Frontend
   npm run dev
   ```
   Admin frontend:
   ```bash
   cd Admin_Frontend
   npm run dev
   ```
   Visit:
   - Client_Frontend: `http://localhost:3000`
   - Restaurant_Frontend: `http://localhost:3001`
   - Admin_Frontend: `http://localhost:3002`

## 🍴 How It Works

- 🖱️ Go to `http://localhost:3000` to start as a customer.
- 🍝 Sign up, explore our emoji-rich menu, and add dishes to your cart.
- 🚚 Order, pay, and track your delivery live.
- ⭐ Drop feedback after delivery.
- 👨‍🍳 Our team manages orders and menus at `http://localhost:3001`.
- ⚙️ Admins oversee everything at `http://localhost:3002`.

## 📁 Structure

```
├── Backend/              # API for auth, orders, and feedback
├── Client_Frontend/      # Customer ordering interface
├── Restaurant_Frontend/  # Menu and order management
├── Admin_Frontend/       # Platform administration
```

## 🎨 Style Notes

- **Colors**: Orange and gray for a bold, appetizing look.
- **Emojis**: Food-themed (🍝🥐🍣) with dark gray for contrast on orange backgrounds.

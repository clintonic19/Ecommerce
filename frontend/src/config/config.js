
export const registerFormControls = [
    {
        name: "firstName",
        label: "First Name:",
        type: "text",
        placeholder: "Enter your first name",
        componentType: 'input',

    },

     {
        name: "lastName",
        label: "Last Name:",
        type: "text",
        placeholder: "Enter your last name",
        componentType: 'input',

    },

     {
        name: "email",
        label: "Email:",
        type: "email",
        placeholder: "Enter your email address",
        componentType: 'input',

    },

        {
        name: "password",
        label: "Password:",
        type: "password",
        placeholder: "********",
        componentType: 'input',

    }
]


export const loginFormControls = [

     {
        name: "email",
        label: "Email:",
        type: "email",
        placeholder: "Enter your email address",
        componentType: 'input',

    },

        {
        name: "password",
        label: "Password:",
        type: "password",
        placeholder: "********",
        componentType: 'input',

    }
]

// export const adminSideBarMenuItems = [
//     {
//     id: "dashboard",
//     label: "Dashboard",
//     path: "/admin/dashboard",
//     icon: <LayoutDashboard size={20}/>,
//     },

//     {
//     id: "products",
//     label: "Products",
//     path: "/admin/products",
//     icon: <ShoppingBasket size={20} />
//     },

//     {
//     id: "orders",
//     label: "Orders",
//     path: "/admin/orders",
//     icon: <CircleStar size={20}/>
//     },

// ]

export const addProductFormElements = [
  {
    label: "Title:",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },

  {
    label: "Description:",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },

  {
    label: "Category:",
    name: "category",
    componentType: "select",
    options: [
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "kids", label: "Kids" },
      { id: "accessories", label: "Accessories" },
      { id: "footwear", label: "Footwear" },
    ],
  },
  
  {
    label: "Brand:",
    name: "brand",
    componentType: "select",
    options: [
      { id: "nike", label: "Nike" },
      { id: "adidas", label: "Adidas" },
      { id: "puma", label: "Puma" },
      { id: "levi", label: "Levi's" },
      { id: "zara", label: "Zara" },
      { id: "h&m", label: "H&M" },
    ],
  },

  {
    label: "Price:",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },

  {
    label: "Sale Price:",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },

  {
    label: "Total Stock:",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

//menu items for shopping view nav bar
export const menuItemsHeaders = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home"
  },

   {
    id: "men",
    label: "Men",
    path: "/shop/list"
  },

   {
    id: "women",
    label: "Women",
    path: "/shop/list"
  },

   {
    id: "kids",
    label: "Kids",
    path: "/shop/list"
  },

   {
    id: "accessories",
    label: "Accessories",
    path: "/shop/list"
  },

   {
    id: "footwear",
    label: "Footwear",
    path: "/shop/list"
  },

]

export const filterOptions = {
  category: [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
    { id: "accessories", label: "Accessories" },
    { id: "footwear", label: "Footwear" },
  ],
  
  brand: [
    { id: "nike", label: "Nike" },
    { id: "adidas", label: "Adidas" },
    { id: "puma", label: "Puma" },
    { id: "levi", label: "Levi's" },
    { id: "zara", label: "Zara" },
    { id: "h&m", label: "H&M" },
  ],
};

export const sortOptions = [
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];
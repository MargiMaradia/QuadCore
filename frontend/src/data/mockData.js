export const mockProducts = [
    {
      _id: "1",
      name: "Steel Rod",
      sku: "SR-100",
      category: "Raw Material",
      quantity: 150,
      unitPrice: 45.00,
      location: "Zone A",
      warehouse: "WH-001",
      status: "active",
      reorderPoint: 50,
      imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=64&h=64"
    },
    {
      _id: "2",
      name: "Copper Wire",
      sku: "CW-200",
      category: "Raw Material",
      quantity: 500,
      unitPrice: 12.50,
      location: "Zone B",
      warehouse: "WH-001",
      status: "active",
      reorderPoint: 200,
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=64&h=64"
    },
    {
      _id: "3",
      name: "Industrial Bolt",
      sku: "IB-050",
      category: "Hardware",
      quantity: 1000,
      unitPrice: 0.85,
      location: "Zone C",
      warehouse: "WH-002",
      status: "active",
      reorderPoint: 500,
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=64&h=64"
    },
    {
      _id: "4",
      name: "Safety Gloves",
      sku: "SG-L",
      category: "Safety Gear",
      quantity: 25,
      unitPrice: 15.00,
      location: "Zone D",
      warehouse: "WH-001",
      status: "low_stock",
      reorderPoint: 50,
      imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=64&h=64"
    },
    {
      _id: "5",
      name: "Packaging Box",
      sku: "PB-X1",
      category: "Packaging",
      quantity: 2000,
      unitPrice: 2.20,
      location: "Zone E",
      warehouse: "WH-002",
      status: "active",
      reorderPoint: 500,
      imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=64&h=64"
    },
    {
      _id: "6",
      name: "Hydraulic Pump",
      sku: "HP-500",
      category: "Machinery",
      quantity: 0,
      unitPrice: 1250.00,
      location: "Zone F",
      warehouse: "WH-001",
      status: "out_of_stock",
      reorderPoint: 5,
      imageUrl: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&w=64&h=64"
    }
  ];
  
  export const mockOperations = [
    {
      _id: "101",
      ref: "WH/IN/001",
      type: "receipt",
      status: "waiting",
      items: [{ product: "Steel Rod", qty: 50, done: 0 }],
      date: "2023-10-24",
      warehouse: "WH-001",
      contact: "Steel Suppliers Inc."
    },
    {
      _id: "102",
      ref: "WH/OUT/005",
      type: "delivery",
      status: "picking",
      items: [{ product: "Copper Wire", qty: 100, pickedQty: 20 }],
      date: "2023-10-25",
      warehouse: "WH-001",
      contact: "ElectroBuild Co.",
      from: "WH-001",
      to: "Customer Site A"
    },
    {
      _id: "103",
      ref: "WH/TR/002",
      type: "transfer",
      status: "pending",
      items: [{ product: "Industrial Bolt", qty: 200 }],
      date: "2023-10-26",
      source: "WH-001",
      destination: "WH-002",
      contact: "Internal Logistics"
    },
    {
      _id: "104",
      ref: "WH/IN/002",
      type: "receipt",
      status: "draft",
      items: [{ product: "Safety Gloves", qty: 100, done: 0 }],
      date: "2023-10-27",
      warehouse: "WH-002",
      contact: "Safety First Ltd."
    },
    {
      _id: "105",
      ref: "WH/OUT/006",
      type: "delivery",
      status: "ready",
      items: [
        { product: "Packaging Box", qty: 500, pickedQty: 500, packedQty: 500 },
        { product: "Safety Gloves", qty: 10, pickedQty: 10, packedQty: 10 }
      ],
      date: "2023-10-28",
      warehouse: "WH-002",
      contact: "PackItUp Services",
      from: "WH-002",
      to: "Customer Site B"
    }
  ];
  
  export const mockWarehouses = [
    { 
      _id: "WH-001", 
      name: "Central Warehouse", 
      code: "CW", 
      address: "123 Logistics Blvd, New York, NY 10001",
      manager: "Alice Manager",
      capacity: 5000
    },
    { 
      _id: "WH-002", 
      name: "Westside Distribution", 
      code: "WD", 
      address: "456 Supply Chain Rd, Los Angeles, CA 90001",
      manager: "Bob Staff",
      capacity: 3000
    }
  ];
  
  export const mockMoves = [
    {
      _id: "m1",
      reference: "WH/IN/001",
      date: "2023-10-24",
      contact: "Steel Suppliers Inc.",
      from: "Vendor",
      to: "WH-001/Zone A",
      product: "Steel Rod",
      quantity: 50,
      status: "done",
      type: "in"
    },
    {
      _id: "m2",
      reference: "WH/OUT/005",
      date: "2023-10-25",
      contact: "ElectroBuild Co.",
      from: "WH-001/Zone B",
      to: "Customer",
      product: "Copper Wire",
      quantity: 20,
      status: "done",
      type: "out"
    },
    {
      _id: "m3",
      reference: "WH/TR/002",
      date: "2023-10-26",
      contact: "Internal Logistics",
      from: "WH-001/Zone C",
      to: "WH-002/Zone C",
      product: "Industrial Bolt",
      quantity: 200,
      status: "done",
      type: "internal"
    },
    {
      _id: "m4",
      reference: "WH/OUT/006",
      date: "2023-10-28",
      contact: "PackItUp Services",
      from: "WH-002/Zone E",
      to: "Customer",
      product: "Packaging Box",
      quantity: 500,
      status: "done",
      type: "out"
    },
    {
      _id: "m5",
      reference: "WH/OUT/006",
      date: "2023-10-28",
      contact: "PackItUp Services",
      from: "WH-002/Zone D",
      to: "Customer",
      product: "Safety Gloves",
      quantity: 10,
      status: "done",
      type: "out"
    }
  ];
  
  export const mockUsers = [
    {
      _id: "u1",
      fullName: "Alice Manager",
      email: "alice@stockmaster.com",
      role: "inventory_manager",
      avatar: "https://ui-avatars.com/api/?name=Alice+Manager&background=1a1a1a&color=dbc39f",
      isActive: true,
      branch: "Central Warehouse",
      address: "789 Manager Ct, New York, NY",
      age: 34,
      gender: "Female",
      manager: "Charlie Admin"
    },
    {
      _id: "u2",
      fullName: "Bob Staff",
      email: "bob@stockmaster.com",
      role: "warehouse_staff",
      avatar: "https://ui-avatars.com/api/?name=Bob+Staff&background=554149&color=fff",
      isActive: true,
      branch: "Westside Distribution",
      address: "321 Worker Ln, Los Angeles, CA",
      age: 28,
      gender: "Male",
      manager: "Alice Manager"
    },
    {
      _id: "u3",
      fullName: "Charlie Admin",
      email: "admin@stockmaster.com",
      role: "admin",
      avatar: "https://ui-avatars.com/api/?name=Charlie+Admin&background=000&color=fff",
      isActive: true,
      branch: "Headquarters",
      address: "101 Admin Blvd, San Francisco, CA",
      age: 45,
      gender: "Male",
      manager: "Board of Directors"
    }
  ];
  
  export const mockNotifications = [
    { id: 1, title: "Low Stock Alert", message: "Safety Gloves are below reorder point.", type: "warning", time: "2 hrs ago" },
    { id: 2, title: "New Receipt", message: "Receipt WH/IN/002 needs validation.", type: "info", time: "5 hrs ago" }
  ];
  
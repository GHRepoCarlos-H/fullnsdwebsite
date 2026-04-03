'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Products', [
      {
        image: "/images/PLAIN BAGEL.jpg",
        us: "3oz BAGEL",
        stockNumber: "892001E128360",
        description: "PLAIN BAGEL",
        uom: "CASE OF 72 BAGELS",
        pkgSize: "10 lbs",
        vendorPartNumber: "WB-10501",
        category: "Bread",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        image: "/images/SESAME BAGEL.jpg",
        us: "3oz BAGEL",
        stockNumber: "892001E128361",
        description: "SESAME BAGEL",
        uom: "CASE OF 72 BAGELS",
        pkgSize: "10 lbs",
        vendorPartNumber: "WB-10502",
        category: "Bread",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        image: "/images/BLUEBERRY MUFFIN.jpg",
        us: "4oz MUFFIN",
        stockNumber: "892001E128362",
        description: "BLUEBERRY MUFFIN",
        uom: "CASE OF 24 MUFFINS",
        pkgSize: "8 lbs",
        vendorPartNumber: "WB-20501",
        category: "Pastry",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        image: "/images/CROISSANT.jpg",
        us: "2.5oz CROISSANT",
        stockNumber: "892001E128363",
        description: "BUTTER CROISSANT",
        uom: "CASE OF 48 CROISSANTS",
        pkgSize: "9 lbs",
        vendorPartNumber: "WB-30501",
        category: "Pastry",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        image: "/images/CHOCOLATE CAKE.jpg",
        us: "8in CAKE",
        stockNumber: "892001E128364",
        description: "CHOCOLATE CAKE",
        uom: "CASE OF 6 CAKES",
        pkgSize: "12 lbs",
        vendorPartNumber: "WB-40501",
        category: "Cake",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};

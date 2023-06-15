const {
  adminLogin,
  addProjectRequisition,
  addMaterialsDetails,
  updateStatus,
  getRequisitions,
  addSupplier,
  supplierDetails,
  supplierEmails,
  deleteSupplier,
  updateSupplier,
  getSupplier,
  getAllRequisitionDetails,
  deleteRequisitionService,
  supplierQuoteDetailsService,
  submitQuoteService,
  quotationProjectService,
  quotationItemService,
  companyDetailsService,
  orderDetailsService,
  createOrderService,
  getOrdersService,
  getprojectOrderService,
  getOrderMaterialService,
} = require("./Admin.service");
const fs = require("fs");
const nodemailer = require("nodemailer");
const { sign } = require("jsonwebtoken");

module.exports = {
  checkLogin: (req, res) => {
    console.log("Hello");
    const data = req.body;
    adminLogin(data, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Invalid Request",
        });
      }
      if (results.length === 0) {
        return res.status(300).json({
          success: 0,
          message: "Invalid Email",
        });
      }
      if (data.password === results[0].password) {
        results[0].password = undefined;
        const jsontoken = sign(
          { result: results[0] },
          process.env.WEBTOKEN_KEY,
          {
            expiresIn: "3h",
          }
        );
        return res.status(200).json({
          success: 1,
          token: jsontoken,
          message: "Logged In Successfully",
        });
      }
      return res.status(500).json({
        success: 0,
        message: "Invalid Password",
      });
    });
  },

  addNewProjectRequisition: (req, res) => {
    var today = new Date();
    var date =
      today.getFullYear() + "" + (today.getMonth() + 1) + "" + today.getDate();
    var time =
      today.getHours() + "" + today.getMinutes() + "" + today.getSeconds();
    var dateTime =
      date + "" + time + "" + Math.floor(Math.random() * 100 + 1) + "_";
    const projectId = dateTime;

    const data = { ...req.body, projectId };

    addProjectRequisition(data, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Bad Request",
        });
      }
      return res.status(200).json({
        success: 1,
        message: "Added Successfully",
        projectId: projectId,
      });
    });
  },

  addMaterialDetailsController: (req, res) => {
    const data = req.body;
    addMaterialsDetails(data, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Bad Request",
        });
      }
      return res.status(200).json({
        success: 1,
        message: "Added Successfully",
        materials: results,
      });
    });
  },

  updateProjectStatus: (req, res) => {
    const data = req.params;
    updateStatus(data, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Bad Request",
        });
      }
      console.log(results);
      return res.status(200).json({
        success: 1,
        message: "Updated Successfully",
      });
    });
  },

  getAllRequisitions: (req, res) => {
    const data = req.params;
    getRequisitions(data, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Bad Request",
        });
      }
      return res.status(200).json({
        success: 1,
        materials: results,
      });
    });
  },

  getAllRequisitionsData: (req, res) => {
    const data = req.body;
    console.log("Api Called");
    console.log(data);
    getAllRequisitionDetails(data, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Bad Request",
        });
      }
      return res.status(200).json({
        success: 1,
        requisitions: results,
      });
    });
  },

  deleteRequisition: (req, res) => {
    const data = req.params;
    deleteRequisitionService(data, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Internal Server Error",
        });
      }
      return res.status(200).json({
        success: 1,
        message: "Requisition Deleted Successfully",
      });
    });
  },

  addNewSupplier: (req, res) => {
    console.log("Request comes");
    var today = new Date();
    var date =
      today.getFullYear() + "" + (today.getMonth() + 1) + "" + today.getDate();
    var time =
      today.getHours() + "" + today.getMinutes() + "" + today.getSeconds();
    var dateTime =
      date + "" + time + "" + Math.floor(Math.random() * 100 + 1) + "_";
    const supplierId = dateTime;
    const fileName = supplierId + req.files.company_details.name;
    const file = req.files.company_details;
    console.log(req.files.company_details.type);
    let uploadPath = __dirname + "/uploads/" + fileName;
    file.mv(uploadPath, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Unable to Upload File",
        });
      }
      const data = { ...req.body, fileName: fileName, supplierId: supplierId };
      console.log(data);
      addSupplier(data, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: 0,
            message: "Bad Request",
          });
        }
        return res.status(200).json({
          success: 1,
          supplierId,
          fileName,
        });
      });
    });
  },

  getSupplierDetails: (req, res) => {
    supplierDetails((err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Bad Request",
        });
      }
      console.log("Hello");
      return res.status(200).json({
        success: 1,
        suppliers: results,
      });
    });
  },

  getSupplierCompanyFile: (req, res) => {
    const data = req.params;
    const path = __dirname + "/uploads/" + data.fileName;
    if (fs.existsSync(path)) {
      return res.sendFile(path);
    }
    return res.status(500).json({
      success: 0,
      message: "FileName not exist",
    });
  },

  getSupplierEmails: (req, res) => {
    supplierEmails((err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Server Error",
        });
      }
      return res.status(200).json({
        success: 1,
        emails: results,
      });
    });
  },

  deleteSupplierDetails: (req, res) => {
    console.log("delete Supplier");
    console.log(req.body);
    const { supplierId, fileName } = req.body;
    const path = __dirname + "/uploads/" + fileName;
    if (fs.existsSync(path)) {
      fs.unlink(path, (err) => {
        if (err)
          return res.status(500).json({
            success: 0,
            message: "File Not Exists",
          });
        console.log("File Deleted Successfully");
        deleteSupplier(supplierId, (err, results) => {
          if (err) {
            return res.status(500).json({
              success: 0,
              message: "Bad Request",
            });
          }
          return res.status(200).json({
            success: 0,
            message: "Supplier Deleted Successfully",
          });
        });
      });
    } else {
      deleteSupplier(supplierId, (err, results) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Bad Request",
          });
        }
        return res.status(200).json({
          success: 0,
          message: "Supplier Deleted Successfully",
        });
      });
    }
  },

  updateSupplierDetails: (req, res) => {
    const data = req.body;
    console.log("update supplier details");
    updateSupplier(data, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Bad Request",
        });
      }
      return res.status(200).json({
        success: 1,
        message: "Updated Record Successfully",
      });
    });
  },

  getCurrentSupplier: (req, res) => {
    const data = req.params.supplierId;
    getSupplier(data, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Bad Request",
        });
      }
      return res.status(200).json({
        success: 1,
        results,
      });
    });
  },

  sentEmail: (req, res) => {
    const { emailDetails, mailBody, subject } = req.body;
    console.log(req.body);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "",
        pass: "",
      },
    });

    const message = {
      from: "your-email-address",
      to: emailDetails,
      subject: subject,
      html: mailBody,
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: 0,
          message: "Bad Request",
        });
      } else {
        console.log(info);
      }
    });
    return res.status(200).json({
      success: 1,
      message: "Mail Sent Successfully",
    });
  },

  tokenValidationSuccessful: (req, res) => {
    return res.status(200).json({
      success: 1,
      message: "Token Successfully Matched",
    });
  },

  supplierQuoteDetailsController: (req, res) => {
    const data = req.body;
    supplierQuoteDetailsService(data, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Internal Server Error",
        });
      }
      return res.status(200).json({
        success: 1,
        insertId: results,
      });
    });
  },

  submitQuoteController: (req, res) => {
    const data = req.body;
    console.log(data);
    submitQuoteService(data, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Bad Request",
        });
      }
      return res.status(200).json({
        success: 1,
        message: "Data Inserted Successfully",
      });
    });
  },

  getQuotationProjectController: (req, res) => {
    quotationProjectService((err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Internal Server Error",
        });
      }
      return res.status(200).json({
        success: 1,
        projects: results,
      });
    });
  },

  getQuotationItemController: (req, res) => {
    const data = req.params;
    quotationItemService(data, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Internal Server Error",
        });
      }
      return res.status(200).json({
        success: 1,
        details: results,
      });
    });
  },

  getCompanyDetails: (req, res) => {
    const data = req.params;
    companyDetailsService(data, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Internal Server Error",
        });
      }
      return res.status(200).json({
        success: 1,
        details: results,
      });
    });
  },

  createOrderController: (req, res) => {
    const data = req.body;
    createOrderService(data, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Internal Server Error",
        });
      }
      return res.status(200).json({
        success: 1,
        orderId: results.insertId,
      });
    });
  },

  orderDetailsController: (req, res) => {
    const data = req.body;
    orderDetailsService(data, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Internal Server Error",
        });
      }
      return res.status(200).json({
        success: 1,
        message: "Order Successfull",
      });
    });
  },

  getOrdersController: (req, res) => {
    getOrdersService((err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Internal Server Error",
        });
      }
      return res.status(200).json({
        success: 1,
        results: results,
      });
    });
  },

  getOrderProjectDetails: (req, res) => {
    const data = req.params;
    getprojectOrderService(data, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Internal Server Error",
        });
      }
      return res.status(200).json({
        success: 1,
        results: results,
      });
    });
  },

  getOrderedMaterials: (req, res) => {
    const data = req.params;
    getOrderMaterialService(data, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Internal Server Error",
        });
      }
      return res.status(200).json({
        success: 1,
        results: results,
      });
    });
  },
};

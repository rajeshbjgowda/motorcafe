// services/reportGenerator.js

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Date Fns is used to format the dates we receive
// from our API call

// define a generatePDF function that accepts a tickets argument
const generatePDF = (tickets) => {
  // initialize jsPDF
  const doc = new jsPDF();

  // define the columns we want and their titles
  const tableColumn = [
    "Sl.No",
    "User ID",
    "Appointment Id",
    "optional service",
    "vehicle id",
    "payment id",
    "payment status",
    "service type",
    "address",
    "status",
  ];
  // define an empty array of rows
  const tableRows = [];

  // for each ticket pass all its data into an array
  tickets.forEach((ticket, index) => {
    const ticketData = [
      index + 1,
      ticket.user_id,
      ticket.optional_service,
      ticket.vehicle_index,
      ticket.payments_details?.payment_id,
      ticket.payments_details?.payment_status,
      ticket.service_type,
      ticket.address_index,
      ticket.status,
    ];
    // push each tickcet's info into a row
    tableRows.push(ticketData);
  });

  // startY is basically margin-top
  //   doc.autoTable(tableColumn, tableRows, { startY: 20 });
  autoTable(doc, {
    head: [tableColumn], // don't forget square brackets, columns is an array of string
    body: tableRows,

    margin: { top: 20 },
    bodyStyles: { width: "100%" },

    tableWidth: "wrap",
    theme: "grid",
    styles: {
      fontSize: 7,
      cellPadding: 1,
    },
  });

  // doc.save(`${"rajesh"}.pdf`);
  // ticket title. and margin-top + margin-left
  //   doc.text("end of report");
  // we define the name of our PDF file.

  // var pdf = doc.output();
  doc.output("dataurlnewwindow");
  // console.log(pdf.name);
};

export default generatePDF;

export const generateInvoicePdf = (details, users, allServices) => {
  // app.component.ts
  console.log("details", details, users[details.user_id]);
  const doc = new jsPDF();
  let serviceData = [];
  let totalPrice = 0;
  details.service_ids.forEach((id, index) => {
    console.log(allServices[id]);

    const { service_name, price, discount, advance_price } = allServices[id];
    let actualPrice = Number(price) * ((100 - Number(discount)) / 100);
    totalPrice += actualPrice;
    let data = [
      index + 1,
      service_name,
      price,
      `${discount}%`,
      advance_price,
      actualPrice,
    ];
    serviceData.push(data);
  });

  details?.extra_services?.forEach((service, index) => {
    const { service_name, price, discount, advance_price } = service;
    let actualPrice = Number(price) * ((100 - Number(discount)) / 100);
    totalPrice += actualPrice;
    let data = [
      details.service_ids?.length + index + 1,
      service_name,
      price,
      `${discount}%`,
      advance_price,
      actualPrice,
    ];
    serviceData.push(data);
  });
  console.log("totalPrice", totalPrice);
  autoTable(doc, {
    body: [
      [
        {
          content: "MOTO CAFE",
          styles: {
            halign: "left",
            fontSize: 20,
            textColor: "#ffffff",
          },
        },
        {
          content: "Invoice",
          styles: {
            halign: "right",
            fontSize: 20,
            textColor: "#ffffff",
          },
        },
      ],
    ],
    theme: "plain",
    styles: {
      fillColor: "#3366ff",
    },
  });

  autoTable(doc, {
    body: [
      [
        {
          content:
            "Reference: #INV0001" +
            "\nDate: 2022-01-27" +
            "\nInvoice number: 123456",
          styles: {
            halign: "right",
          },
        },
      ],
    ],
    theme: "plain",
  });

  autoTable(doc, {
    body: [
      [
        {
          content:
            "From:" +
            "\nmoto cafe" +
            "\nBengaluru " +
            "\nRajaji Nagara" +
            "\nZip code - City" +
            "\nCountry",
          styles: {
            halign: "left",
          },
        },
        {
          content:
            "Billed to:" +
            `\n${users[details.user_id]?.username}` +
            `\n${
              users[details.user_id]?.address[details.address_index]
                ?.address_priamry
            }` +
            `\n${
              users[details.user_id]?.address[details.address_index]?.address1
            }` +
            `\n${
              users[details.user_id]?.address[details.address_index]?.address2
            }` +
            `\n${
              users[details.user_id]?.address[details.address_index]?.state
            }-${
              users[details.user_id]?.address[details.address_index]?.pincode
            }`,
          styles: {
            halign: "right",
            cellWidth: 50,
          },
        },
        // {
        //   content:
        //     "Shipping address:" +
        //     "\nJohn Doe" +
        //     "\nShipping Address line 1" +
        //     "\nShipping Address line 2" +
        //     "\nZip code - City" +
        //     "\nCountry",
        //   styles: {
        //     halign: "right",
        //   },
        // },
      ],
    ],
    theme: "plain",
  });

  // autoTable(doc, {
  //   body: [
  //     [
  //       {
  //         content: "Amount due:",
  //         styles: {
  //           halign: "right",
  //           fontSize: 14,
  //         },
  //       },
  //     ],
  //     [
  //       {
  //         content: "$4000",
  //         styles: {
  //           halign: "right",
  //           fontSize: 20,
  //           textColor: "#3366ff",
  //         },
  //       },
  //     ],
  //     [
  //       {
  //         content: "Due date: 2022-02-01",
  //         styles: {
  //           halign: "right",
  //         },
  //       },
  //     ],
  //   ],
  //   theme: "plain",
  // });

  autoTable(doc, {
    body: [
      [
        {
          content: "Services",
          styles: {
            halign: "left",
            fontSize: 14,
          },
        },
      ],
    ],
    theme: "plain",
  });

  autoTable(doc, {
    head: [
      ["Sl.No", "Service Name", "MRP", "Discount", "Advance Amount", "Price"],
    ],
    body: serviceData,
    theme: "striped",
    headStyles: {
      fillColor: "#343a40",
    },
  });

  autoTable(doc, {
    body: [
      [
        {
          content: "Subtotal:",
          styles: {
            halign: "right",
          },
        },
        {
          content: totalPrice,
          styles: {
            halign: "right",
          },
        },
      ],
      [
        {
          content: "Total tax:",
          styles: {
            halign: "right",
          },
        },
        {
          content: "$400",
          styles: {
            halign: "right",
          },
        },
      ],
      [
        {
          content: "Total amount:",
          styles: {
            halign: "right",
          },
        },
        {
          content: "$4000",
          styles: {
            halign: "right",
          },
        },
      ],
    ],
    theme: "plain",
  });

  autoTable(doc, {
    body: [
      [
        {
          content: "Terms & notes",
          styles: {
            halign: "left",
            fontSize: 14,
          },
        },
      ],
      [
        {
          content:
            "orem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia" +
            "molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum" +
            "numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium",
          styles: {
            halign: "left",
          },
        },
      ],
    ],
    theme: "plain",
  });

  autoTable(doc, {
    body: [
      [
        {
          content: "This is a centered footer",
          styles: {
            halign: "center",
          },
        },
      ],
    ],
    theme: "plain",
  });
  doc.output("dataurlnewwindow");
  // return doc.save("invoice");
};

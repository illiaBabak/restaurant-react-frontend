// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

export const MOCK_WAITERS = [
  {
    id: "1",
    name: "John",
    surname: "Miller",
    email: "john.miller@example.com",
    phone_number: "+48600111001",
    address: "Warsaw, ul. Mokotowska 10",
  },
  {
    id: "2",
    name: "Anna",
    surname: "Kowalska",
    email: "anna.kowalska@example.com",
    phone_number: "+48600111002",
    address: "Krakow, ul. Florianska 5",
  },
  {
    id: "3",
    name: "Michael",
    surname: "Smith",
    email: "m.smith@example.com",
    phone_number: "+48600110003",
    address: "Gdansk, ul. Dluga 20",
  },
  {
    id: "4",
    name: "Natalia",
    surname: "Nowak",
    email: "n.nowak@example.com",
    phone_number: "+48600111004",
    address: "Wroclaw, ul. Legnicka 50",
  },
  {
    id: "5",
    name: "Robert",
    surname: "Brown",
    email: "r.brown@example.com",
    phone_number: "+48600111005",
    address: "Poznan, ul. Piekary 12",
  },
  {
    id: "6",
    name: "Karolina",
    surname: "Lewandowska",
    email: "k.lewandowska@example.com",
    phone_number: "+48600111006",
    address: "Lodz, ul. Piotrkowska 90",
  },
  {
    id: "7",
    name: "Daniel",
    surname: "Wójcik",
    email: "d.wojcik@example.com",
    phone_number: "+48600111007",
    address: "Katowice, ul. Chorzowska 25",
  },
  {
    id: "8",
    name: "Emily",
    surname: "Johnson",
    email: "emily.johnson@example.com",
    phone_number: "+48600111008",
    address: "Gdynia, ul. Swietojanska 14",
  },
  {
    id: "9",
    name: "Piotr",
    surname: "Kaminski",
    email: "piotr.kaminski@example.com",
    phone_number: "+48600111009",
    address: "Szczecin, ul. Rayskiego 3",
  },
  {
    id: "10",
    name: "Laura",
    surname: "Zielinska",
    email: "laura.zielinska@example.com",
    phone_number: "+48600111010",
    address: "Bydgoszcz, ul. Dworcowa 28",
  },
  {
    id: "11",
    name: "Adam",
    surname: "Sikora",
    email: "adam.sikora@example.com",
    phone_number: "+48 600 111 011",
    address: "Lublin, ul. Lipowa 50",
  },
  {
    id: "12",
    name: "Julia",
    surname: "Wisniewska",
    email: "j.wisniewska@example.com",
    phone_number: "+48 600 111 012",
    address: "Rzeszow, ul. Hetmanska 8",
  },
  {
    id: "13",
    name: "Chris",
    surname: "Davis",
    email: "chris.davis@example.com",
    phone_number: "+48 600 111 013",
    address: "Opole, ul. Krakowska 4",
  },
  {
    id: "14",
    name: "Oliwia",
    surname: "Mazur",
    email: "oliwia.mazur@example.com",
    phone_number: "+48 600 111 014",
    address: "Torun, ul. Szeroka 6",
  },
  {
    id: "15",
    name: "Tom",
    surname: "Evans",
    email: "t.evans@example.com",
    phone_number: "+48 600 111 015",
    address: "Kielce, ul. Sienkiewicza 77",
  },
  {
    id: "16",
    name: "Sara",
    surname: "Pavlovic",
    email: "sara.pavlovic@example.com",
    phone_number: "+48 600 111 016",
    address: "Bialystok, ul. Lipowa 30",
  },
  {
    id: "17",
    name: "Mateusz",
    surname: "Zawadzki",
    email: "mateusz.zawadzki@example.com",
    phone_number: "+48 600 111 017",
    address: "Radom, ul. Zeromskiego 19",
  },
  {
    id: "18",
    name: "Sophie",
    surname: "Martin",
    email: "s.martin@example.com",
    phone_number: "+48 600 111 018",
    address: "Gliwice, ul. Zwyciestwa 58",
  },
  {
    id: "19",
    name: "Lukas",
    surname: "Fischer",
    email: "l.fischer@example.com",
    phone_number: "+48 600 111 019",
    address: "Zabrze, ul. Wolnosci 2",
  },
  {
    id: "20",
    name: "Katarzyna",
    surname: "Baran",
    email: "kat.baran@example.com",
    phone_number: "+48 600 111 020",
    address: "Olsztyn, ul. Prosta 9",
  },
];

export const MOCK_DISHES = [
  {
    id: "1",
    name: "Margherita Pizza",
    price: 28,
    weight: 450,
    category: "Pizza",
  },
  {
    id: "2",
    name: "Pepperoni Pizza",
    price: 32,
    weight: 480,
    category: "Pizza",
  },
  {
    id: "3",
    name: "Carbonara Pasta",
    price: 27,
    weight: 380,
    category: "Pasta",
  },
  {
    id: "4",
    name: "Bolognese Pasta",
    price: 26,
    weight: 400,
    category: "Pasta",
  },
  {
    id: "5",
    name: "Caesar Salad",
    price: 22,
    weight: 300,
    category: "Salad",
  },
  {
    id: "6",
    name: "Greek Salad",
    price: 21,
    weight: 310,
    category: "Salad",
  },
  {
    id: "7",
    name: "Chicken Soup",
    price: 18,
    weight: 350,
    category: "Soup",
  },
  {
    id: "8",
    name: "Tomato Soup",
    price: 16,
    weight: 330,
    category: "Soup",
  },
  {
    id: "9",
    name: "Beef Burger",
    price: 29,
    weight: 420,
    category: "Burger",
  },
  {
    id: "10",
    name: "Chicken Burger",
    price: 27,
    weight: 410,
    category: "Burger",
  },
  {
    id: "11",
    name: "Sushi Set Classic",
    price: 45,
    weight: 600,
    category: "Sushi",
  },
  {
    id: "12",
    name: "Sushi Set Premium",
    price: 69,
    weight: 700,
    category: "Sushi",
  },
  {
    id: "13",
    name: "Beef Steak",
    price: 65,
    weight: 500,
    category: "Meat",
  },
  {
    id: "14",
    name: "Chicken Fillet",
    price: 38,
    weight: 450,
    category: "Meat",
  },
  {
    id: "15",
    name: "Fried Shrimps",
    price: 52,
    weight: 350,
    category: "Seafood",
  },
  {
    id: "16",
    name: "Grilled Salmon",
    price: 58,
    weight: 420,
    category: "Seafood",
  },
  {
    id: "17",
    name: "French Fries",
    price: 12,
    weight: 180,
    category: "Side",
  },
  {
    id: "18",
    name: "Mashed Potatoes",
    price: 14,
    weight: 200,
    category: "Side",
  },
  {
    id: "19",
    name: "Chocolate Cake",
    price: 24,
    weight: 160,
    category: "Dessert",
  },
  {
    id: "20",
    name: "Cheesecake",
    price: 25,
    weight: 170,
    category: "Dessert",
  },
];

const PAGE_SIZE = 10;

let waitersDB = [...MOCK_WAITERS];
let dishesDB = [...MOCK_DISHES];

beforeEach(() => {
  waitersDB = [...MOCK_WAITERS];
  dishesDB = [...MOCK_DISHES];

  cy.intercept("GET", "http://localhost:8000/waiter/all", (req) => {
    req.reply({
      body: {
        data: MOCK_WAITERS,
      },
    });
  }).as("getAllWaiters");

  cy.intercept("GET", "http://localhost:8000/waiter?page=*", (req) => {
    const pageParam = req.query.page || "1";
    const page = Number(pageParam);

    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    const data = waitersDB.slice(start, end);

    req.reply({
      statusCode: 200,
      body: {
        data: {
          currentPageNumber: page,
          pageData: data,
          pageSize: PAGE_SIZE,
          totalCount: waitersDB.length,
          totalPages: Math.ceil(waitersDB.length / PAGE_SIZE),
        },
      },
    });
  }).as("getWaiters");

  cy.intercept("GET", "http://localhost:8000/dish?page=*", (req) => {
    const pageParam = req.query.page || "1";
    const page = Number(pageParam);

    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    const data = dishesDB.slice(start, end);

    req.reply({
      statusCode: 200,
      body: {
        data: {
          currentPageNumber: page,
          pageData: data,
          pageSize: PAGE_SIZE,
          totalCount: dishesDB.length,
          totalPages: Math.ceil(dishesDB.length / PAGE_SIZE),
        },
      },
    });
  }).as("getDishes");

  cy.intercept("POST", "http://localhost:8000/waiter", (req) => {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    expect(body).to.deep.equal({
      name: "Test user",
      surname: "Test surname",
      email: "test@example.com",
      phone_number: "+48123456789",
      address: "Test, New York",
    });

    const newWaiter = {
      id: (waitersDB.length + 1).toString(),
      ...body,
    };

    waitersDB = [newWaiter, ...waitersDB];

    req.reply({
      statusCode: 201,
    });
  }).as("createWaiter");

  cy.intercept("DELETE", "http://localhost:8000/waiter", (req) => {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    expect(body).to.deep.equal({
      id: body.id,
    });

    waitersDB = waitersDB.filter((w) => w.id !== body.id);

    req.reply({
      statusCode: 200,
    });
  }).as("deleteWaiter");

  cy.intercept("PUT", "http://localhost:8000/waiter", (req) => {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    expect(body).to.deep.equal({
      ...body,
      name: "Updated test user",
    });

    waitersDB = waitersDB.map((w) =>
      w.id === body.id ? { ...w, ...body } : w
    );

    req.reply({
      statusCode: 200,
    });
  }).as("updateWaiter");

  cy.intercept("POST", "http://localhost:8000/dish", (req) => {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    expect(body).to.deep.equal({
      name: "Test dish",
      price: 10,
      weight: 200,
      category: "main",
    });

    const newDish = {
      id: (dishesDB.length + 1).toString(),
      ...body,
    };

    dishesDB = [newDish, ...dishesDB];

    req.reply({
      statusCode: 201,
    });
  }).as("createDish");

  cy.intercept("DELETE", "http://localhost:8000/dish", (req) => {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    expect(body).to.deep.equal({
      id: body.id,
    });

    dishesDB = dishesDB.filter((d) => d.id !== body.id);

    req.reply({
      statusCode: 200,
    });
  }).as("deleteDish");

  cy.intercept("PUT", "http://localhost:8000/dish", (req) => {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    expect(body).to.deep.equal({
      ...body,
      name: "Updated test dish",
    });

    dishesDB = dishesDB.map((d) => (d.id === body.id ? { ...d, ...body } : d));

    req.reply({
      statusCode: 200,
    });
  }).as("updateDish");
});

console.clear();

const http = require("http");
const url = require("url");

let phones = [
  { id: 1, name: "iPhone 14", brand: "Apple", price: 1200, stock: 10 },
  { id: 2, name: "Galaxy S23", brand: "Samsung", price: 1000, stock: 8 },
  { id: 3, name: "Pixel 7", brand: "Google", price: 900, stock: 5 },
  { id: 4, name: "iPhone SE", brand: "Apple", price: 800, stock: 15 },
];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true); 
  const path = parsedUrl.pathname;
  const method = req.method;

  if (path.startsWith("/phones/") && method === "GET") {
    const id = parseInt(path.split("/")[2], 10); 

    const phone = phones.find((p) => p.id === id);

    if (phone) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(phone));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Phone not found" }));
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

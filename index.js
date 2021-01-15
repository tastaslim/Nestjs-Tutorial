import fs from 'fs';
import http from 'http';
import url from 'url';
const productPage = fs.readFileSync(`./starter/templates/product.html`, 'utf-8');
const overviewPage = fs.readFileSync(`./starter/templates/overview.html`, 'utf-8');
const templatePage = fs.readFileSync(`./starter/templates/template.html`, 'utf-8');
const jasonData = fs.readFileSync(`./starter/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(jasonData);

const replaceDataWithJason = (temp, product) => {
	let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
	output = output.replace(/{%IMAGE%}/g, product.image);
	output = output.replace(/{%QUANTITY%}/g, product.quantity);
	output = output.replace(/{%FROM%}/g, product.from);
	output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
	output = output.replace(/{%PRICE%}/g, product.price);
	output = output.replace(/{%DESCRIPTION%}/g, product.description);
	output = output.replace(/{%ID%}/g, product.id);
	if (!product.organic) {
		output = output.replace(/{%notOrgainc%}/g, 'not-organic');
	}
	return output;
};
const server = http.createServer((req, res) => {
	console.log(url.parse(req.url, true));
	const { pathname, query } = url.parse(req.url, true);
	if (pathname === '/template') {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.end(templatePage);
	} else if (pathname === '/overview' || pathname === '/') {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		const cardHtml = dataObject.map((element) => replaceDataWithJason(templatePage, element)).join('');
		const outputdata = overviewPage.replace('{%PRODUCT_CARDS%}', cardHtml);
		res.end(outputdata);
	} else if (pathname === '/product') {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		const productData = dataObject[query.id];
		const prooductHtml = replaceDataWithJason(productPage, productData);
		res.end(prooductHtml);
	} else {
		res.writeHead(404, { 'Content-Type': 'text/html' });
		res.end('<h1>Not found</h1>');
	}
});
const port = 3000 | process.env.port;
server.listen(port, () => {
	console.log(`Server is running on ${port}`);
});

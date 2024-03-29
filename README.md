# Node JS Point Of Sale


![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JS](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![NODE JS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![EXPRESS](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![MONGO DB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![REDIS](https://img.shields.io/badge/redis-CD2640?style=for-the-badge&logo=redis&logoColor=white)


![Image of the POS](https://www.carlospadron.dev/images/ricard2.png)

**The language of this project is Spanish**

A good looking point of sale to manage small stationeries

## Modules
* Inventory
* Sales
* Quotes
* Losses
* Other Movements
* Cash Outs


## Installation

Just clone the project and run `npm install` to install the dependencies

After that, create an .env file and add the following variables: 
```
MODE=PRODUCTION #PRODUCTION / DEVELOPMENT
PRODUCTION_DATABASE = #connection string
DEVELOPMENT_DATABASE= #connection string
SECRET_KEY= #Secret key for the JWT
MONGO_DB_AUTH_SOURCE=admin
REDIS_SECRET= #Secret key to generate a session
BCRYPT_ROUNDS=
REDIS_HOST=
DEFAULT_PRODUCTS_ROUTE=https://{yourDomain}/inventario/productos
DEFAULT_USER_ROUTE=https://{yourDomain}/perfil
SENDINBLUE_API_KEY=#sendInBlue APIKEY to send email in case some forget his pw
BUSINESS_NAME= #name of the buisiness. This will apper in the emails
BUSINESS_EMAIL=no-reply@yourDomain.com

#To send emails is required to have a sendInBlue accunt and have configured a domain in your sendInBlue account
```
To start using the POS yout need to add a user from the database withe the role 'admin'. The password must be hashed with node js bcrypt package
 You can change the logo with your stationery logo


## License
[MIT](https://choosealicense.com/licenses/mit/)

# Node JS Point Of Sale


![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JS](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![NODE JS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![EXPRESS](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![MONGO DB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![REDIS](https://img.shields.io/badge/Node.js-CD2640?style=for-the-badge&logo=redis&logoColor=white)


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
REDIS_SECRET= #Secret key to generate a session
BCRYPT_ROUNDS=
REDIS_HOST=
DEFAULT_PRODUCTS_ROUTE=https://{yourDomain}/inventario/productos
DEFAULT_USER_ROUTE=https://{yourDomain}/perfil
EMAIL=#email account to send mails in case someone forget his password
EMAIL_PW=#email password
```
To start using the POS yout need to add a user from the database. the password must be hashed with node js bcrypt package


## License
[MIT](https://choosealicense.com/licenses/mit/)

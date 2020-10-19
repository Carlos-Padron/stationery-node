const express = require('express')
const router = new express.Router()

router.get('/dashboard',(req, res)=>{

    res.render('dashboard',{
        name: 'Tablero',
        script:'dashboardClient'
    }) 
   /*  if (req.session.key) {
        res.render('dashboard',{
            name: 'Tablero'
        })    
    } else {
        res.render('login',{
            script: 'loginClient'
        })
    }
 */
    
})

module.exports = router
const mysql = require( 'mysql' );

class Database {
    constructor( config ) {
        this.connection = mysql.createConnection( config );
        this.connection ? console.log('db connection established'):process.exit(0);
    }
    query( sql, args=[] ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
  }


const db = new Database({
    host: "localhost",
    port: 3306,
    user: "root",
    password: '',
    database: "hatter"
});

async function addHatt(data){
    console.log(`adding hatt`,data);
    const result = await db.query(`insert into hatts (user_id,text) values (? ,?)`, [data.user_id,data.text]);
    return result;
}

async function deleteHatt(data){
    console.log('deleting hatt', data);
    let result = await db.query('delete from hatts where id=?',[data.id]);
    result = await db.query('delete from comments where hatt_id=?',[data.id]);
    return result;
}

async function addUser(data){
    // console.log(`adding user: ${data}`);
    result = await db.query(`insert into users (name,email,password) values (?,?,?)`,[data.name,data.email,data.password]);
    return result;
}

async function deleteUser(data){
    console.log(`deleting: ${data}`);
    result = await db.query(`delete from users where id=?`,[data.id]);
    // result = await db.query()
    return result;
}

async function addComment(data){
    console.log('adding comment to db...');
    const result = await db.query(`insert into comments (hatt_id,user_id,comment) values (? , ? , ?)`,[data.hatt_id,data.user_id,data.comment]);
    // console.log(result);
    return result;
}

async function deleteComment(data){
    console.log('deleting comment from db...');
    result = await db.query('delete from comments where id=?',[data.id]);
    return result;
}

async function getUserHatts(data){
    console.log(' getting user hatts from db ... ');
    result = await db.query('select * from hatts where user_id=?',[data.user_id]);
    return result;
}

module.exports = {
    addHatt,
    deleteHatt,
    addUser,
    deleteUser,
    addComment,
    deleteComment,
    getUserHatts
}

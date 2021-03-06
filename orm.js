const mysql = require( 'mysql' );

class Database {
    constructor( config ) {
        if (process.env.JAWSDB_URL) {
            // Database is JawsDB on Heroku
            this.connection = mysql.createConnection(process.env.JAWSDB_URL);
        } else {
            this.connection = mysql.createConnection( config );
        }
        
        this.connection ? console.log('db connection established'):process.exit(0);
    }
    query( sql, args=[] ) {
        return new Promise( ( resolve, reject ) => {
            
            this.connection.query( sql, args, ( error, results,fields ) => {
                if ( error ) {
                    resolve (error.code);
                } else
                //     console.log('returning error!');
                //     return reject( err );
                resolve( results );
            } );
        
        // catch (error){
        //     throw (error);
        //     // console.log('logging error from catch...',error);
        //     reject (error);
        // }
        } ).catch(error=>{
            console.log(error.code);
        });
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
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME
});


async function addHatt(data){
    // console.log(`adding hatt`,data);
    const result = await db.query(`insert into hatts (user_id,text) values (? ,?)`, [data.user_id,data.text]);
    return result;
}

async function deleteHatt(data){
    // console.log('deleting hatt', data);
    let result = await db.query('delete from hatts where id=?',[data.id]);
    result = await db.query('delete from comments where hatt_id=?',[data.id]);
    return result;
}

async function addUser(data){
    // console.log(`adding user: ${data}`);
    const result = await db.query(`insert into users (name,email,password,location,picture_path) values (?,?,?,?,?)`,[data.name,data.email,data.password,data.location,data.picture_path]);
    // if (result == 'ER_DUP_ENTRY'){
    //     console.log('duplicated email id!');
    // }
    return result;
}

async function authUser(data){
    const query = `select * from users where email="${data.email}"`;
    console.log(query);
    const result = await db.query(query);
    console.log(result);
    return result;
}

async function searchTerm(data){
    //const query = `select * from hatts where text LIKE "%${data.searchTerm}%"`;
    const query = `select t.id, t.user_id, t.text,t.attachement,t.tweet_time, u.name, u.picture_path, count(distinct c.id) AS commentCount
    from hatts t 
    left join users u on t.user_id=u.id 
    left join comments c on t.id = c.hatt_id 
    where t.text like '%${data.searchTerm}%' 
    group by t.id
    order by t.tweet_time DESC;`
    //console.log(query);
    const result = await db.query(query);
    //console.log(result);
    return result;
}

async function deleteUser(data){
    // console.log(`deleting: ${data}`);
    result = await db.query(`delete from users where id=?`,[data.id]);
    // result = await db.query()
    return result;
}

async function addComment(data){
    // console.log('adding comment to db...');
    const result = await db.query(`insert into comments (hatt_id,user_id,comment) values (? , ? , ?)`,[data.hatt_id,data.user_id,data.comment]);
    // console.log(result);
    return result;
}

async function deleteComment(data){
    // console.log('deleting comment from db...');
    result = await db.query('delete from comments where id=?',[data.id]);
    return result;
}

async function getUserHatts(data){
    // console.log(' getting user hatts from db ... ');
    result = await db.query('select a.id,a.user_id,a.likecount,b.name ,a.text,a.tweet_time,b.picture_path from hatts a left join users b on a.user_id = b.id where a.user_id = ? order by a.tweet_time desc',[data.user_id]);
    return result;
}

async function getRecentHatts(data){
    result = await db.query('select a.id,a.user_id,a.text,a.tweet_time,b.name,b.picture_path,a.likecount from hatts a left join users b on a.user_id = b.id order by tweet_time desc');
    return result;
}

async function getNoOfCommentsPerHatt(){
    result = await db.query('select hatt_id,count(*) as num from comments group by hatt_id');
    return result;
}

async function getTop10Followed(){
    result = await db.query('select a.user, b.name, b.picture_path,count(*) as num from followers a left join users b on a.user=b.id group by a.user order by num desc limit 10;')
    return result;
}

async function addFollower(data){
    // console.log('logging data for addFollower orm function',data);
    // result = await db.query(`insert into followers (user,follower) values (?,?)`,[data.user,data.follower]);
    // let query = `insert into followers (user, follower) select ${data.user},${data.follower} from dual where not exists (select * from followers where user=${data.user} and follower=${data.follower})`;
    // console.log(query);
    result =  await db.query(`insert into followers (user, follower) select ${data.user},${data.follower} from dual where not exists (select * from followers where user=${data.user} and follower=${data.follower})`);
    return result;
}

async function getProfilePic(data){
    // console.log('logging data for getProfilePic orm function', data);
    // result = await db.query(`insert into followers (user,follower) values (?,?)`,[data.user,data.follower]);
    let query = `select picture_path from users where id=${data}`;
    // console.log(query);
    result =  await db.query(query);
    // console.log(result);
    return result;
}

async function updateLikeCount(data){
    let query = `update hatts set likecount=${data.count} where id=${data.hatt_id}`
    const result = await db.query(query);
    return result;
}

async function getFollowers(data){
    console.log('logging data for getFollowers orm function', data);
    // result = await db.query(`insert into followers (user,follower) values (?,?)`,[data.user,data.follower]);
    let query = `select user, count(*) as numOfFollowers from followers where user=${data}`;
    console.log(query);
    result =  await db.query(query);
    console.log(result);
    return result;
}

async function getFollowing(data){
    console.log('logging data for getFollowing orm function', data);
    // result = await db.query(`insert into followers (user,follower) values (?,?)`,[data.user,data.follower]);
    let query = `select follower, count(*) as numFollowing from followers where follower=${data}`;
    console.log(query);
    result =  await db.query(query);
    console.log(result);
    return result;
}

async function getHatts(data){
    // console.log(' getting user hatts from db ... ');
    result = await db.query(`select user_id, count(*) as numOfHatts from hatts where user_id=${data}`);
    return result;
}

async function getSingleHatt(data){
    // console.log(' getting user hatts from db ... ');
    result = await db.query(`select a.id,a.user_id,a.text,a.tweet_time,a.likecount,b.name,b.picture_path from hatts a left join users b on a.user_id=b.id where a.id=${data.id}`);
    return result;
}

async function getComments(data){
    // console.log(' getting user hatts from db ... ');
    result = await db.query(`select a.user_id,a.comment,a.comment_time,b.name from comments a left join users b on a.user_id = b.id where hatt_id=${data.id}`);
    return result;
}

async function getNamefromUserID(data){
    //console.log(' getting name from userid ... ');
    let query = `select name from users where id=${data}`;
    result = await db.query(query);
    //console.log(result);
    return result;
}

async function getUserEmailfromName(data){
    //console.log(' getting name from userid ... ');
    let query = `select id, email from users where name="${data}"`;
    result = await db.query(query);
    //console.log(result);
    return result;
}

module.exports = {
    addHatt,
    deleteHatt,
    addUser,
    authUser,
    deleteUser,
    addComment,
    deleteComment,
    getUserHatts,
    getRecentHatts,
    getNoOfCommentsPerHatt,
    getTop10Followed,
    addFollower,
    getProfilePic,
    getFollowers,
    getFollowing,
    getHatts,
    getComments,
    getSingleHatt,
    searchTerm,
    getNamefromUserID,
    updateLikeCount,
    getUserEmailfromName
}

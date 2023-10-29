/**
 * dbCommunicator.ts - A class for interacting with a MySQL database using the mysql2 library.
 */

import mysql from 'mysql2/promise';
import 'dotenv/config';

/**
 * Database configuration object.
 */
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DATABASE,
};
if (!dbConfig.host || !dbConfig.user || !dbConfig.password || !dbConfig.database) {
    console.error('Missing database configuration.'); // replace with logger when we gain access to it
    process.exit(1);
}


/* TODO List / Things to Implement/Consider:
    * - Add the logger to the DBCommunicator class
    * - Database Connection Pooling:
        Consider using a connection pool for your database connections. 
        Connection pooling can help improve performance and security. 
        It manages the connections efficiently, reducing the risk of 
        resource exhaustion and other issues.
    * - SQL Injection Prevention:
        Your code currently uses parameterized queries, which is a good 
        practice to prevent SQL injection. However, it's essential to 
        ensure that all SQL queries, even dynamic ones, are properly 
        parameterized to eliminate the risk of injection.    
    * - Authentication and Authorization:
        This code snippet does not address authentication and authorization, 
        which are critical components of database security. Ensure that your 
        MySQL server is properly configured with user accounts and access 
        control to limit the exposure of your database.
    * - Secure Your Environment:
        Make sure your production environment is adequately secured, including 
        firewalls, intrusion detection, and monitoring systems.
    * - Data Encryption:
        Ensure that your database connections are encrypted, especially for 
        production environments. MySQL supports SSL/TLS encryption for secure data transmission.
    * - Data Validation:
        Ensure that any data passed into SQL queries is validated and sanitized. 
        This includes not just parameterized queries but also checking data types 
        and lengths to prevent data-related vulnerabilities.
    * - Audit Trails:
        Consider adding audit trails to log and monitor all activities within the 
        database to detect and respond to any suspicious or unauthorized behavior.
 */

/**
 * A class for interacting with a MySQL database using the mysql2 library.
 */
class DBCommunicator {
  private connection : mysql.Connection | null = null;

  /**
   * Constructor for DBCommunicator.
   * It establishes a connection to the MySQL database.
   */
  constructor() {
    this.connect();
  }

  /**
   * Establishes a connection to the MySQL database.
   */
  private async connect() {
    try {
      this.connection = await mysql.createConnection(dbConfig);
      console.log('Connected to MySQL database'); // replace with logger when we gain access to it
    } catch (error) {
      console.error('Error connecting to the database:', error); // replace with logger when we gain access to it
    }
  }

  /**
   * Executes a SQL query on the connected database.
   * @param sql - The SQL query to execute.
   * @param values - An array of values to replace placeholders in the SQL query.
   * @returns A promise that resolves with the query results or null on error.
   */
  async query(sql: string, values: any[] = []) {
    if (!this.connection) {
      console.error('Database connection not established.'); // replace with logger when we gain access to it
      return null;
    }

    try {
      const [rows, fields] = await this.connection.execute(sql, values);
      return rows;
    } catch (error) {
      console.error('Database query error:', error); // replace with logger when we gain access to it
      return null;
    }
  }

  /**
   * Closes the connection to the MySQL database.
   */
  async close() {
    if (this.connection) {
      await this.connection.end();
      console.log('Database connection closed.'); // replace with logger when we gain access to it
    }
  }
}

export default new DBCommunicator();


// EXAMPLE USAGES:
/* Select Data from a Table
    const sql = 'SELECT * FROM your_table';
    const results = await db.query(sql);
    console.log('Query results:', results); 
   */
/* Insert Data into a Table
    const insertSql = 'INSERT INTO your_table (column1, column2) VALUES (?, ?)';
    const values = ['value1', 'value2'];
    const insertResult = await db.query(insertSql, values);
    console.log('Insert result:', insertResult);
   */
/* Update Data in a Table 
    const updateSql = 'UPDATE your_table SET column1 = ? WHERE column2 = ?';
    const values = ['new_value', 'target_value'];
    const updateResult = await db.query(updateSql, values);
    console.log('Update result:', updateResult);
   */
/* Delete Data from a Table
    const deleteSql = 'DELETE FROM your_table WHERE column = ?';
    const value = 'value_to_delete';
    const deleteResult = await db.query(deleteSql, [value]);
    console.log('Delete result:', deleteResult);
   */
/* Execute Custom Queries
    const customSql = 'SELECT column1, column2 FROM your_table WHERE column3 = ? ORDER BY column4 DESC LIMIT 10';
    const values = ['filter_value'];
    const customQueryResult = await db.query(customSql, values);
    console.log('Custom query result:', customQueryResult);
   */

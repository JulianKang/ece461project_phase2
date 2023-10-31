import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import {APIHelpPackageContent, APIHelpPackageURL, authenticateUser} from './server_helper'
const jwt = require('jsonwebtoken');
// Example Request: curl -X POST -H "Content-Type: application/json" -d 
//'{"name": "Sample Package", "version": "1.0.0", "data": {"URL": "https://example.com/package.zip"}}' http://localhost:3000/packages

/**
 * PackageManagementAPI
 * 
 * Functions:
 *  this.app.post('/packages', this.handleSearchPackages.bind(this));
    this.app.delete('/reset', this.handleReset.bind(this));
    this.app.get('/package/:id', this.handleGetPackageById.bind(this));
    this.app.put('/package/:id', this.handleUpdatePackageById.bind(this));
    this.app.delete('/package/:id', this.handleDeletePackageById.bind(this));
    this.app.post('/package', this.handleCreatePackage.bind(this));
    this.app.get('/package/:id/rate', this.handleRatePackage.bind(this));
    this.app.put('/authenticate', this.handleAuthenticateUser.bind(this));
    this.app.get('/package/byName/:name', this.handleGetPackageByName.bind(this));
    this.app.delete('/package/byName/:name', this.handleDeletePackageByName.bind(this));
    this.app.post('/package/byRegEx', this.handleSearchPackagesByRegex.bind(this));
 * 
 * Current Progres:
 * 1. Most of Package Ingestion is Complete (handleCreatePackage), URL and zip content can
 * both be analyzed to get metric scores, however, adding package to data base and creating a
 * response code still needs to be done.
 * 
 * 2. Created skeleton responses for all endpoints ( a lot should just be data base queries now and formatting return)
 * 
 * Need to be done:
 * 1. DataBase queries for all functions
 * 2. Authentication
 * 3. Return objects (for successfull queries)
 * 
 * Issues I see:
 * 1. Their code is slow
 * 2. we need to update their Ramp_Up_Score, I think it is always < 0.5
 * 3. We need to include the new metrics
 * 
 * 
 */

class PackageManagementAPI {
  private app: express.Express;
  private packages: any[];
  private nextPackageId: number;

  constructor() {
    this.app = express();
    this.app.use(bodyParser.json());

    this.packages = [];
    this.nextPackageId = 1;

    // Middleware for authentication (placeholder)
    this.app.use(this.authenticate);

    // Define routes
    this.app.get('/', this.handleDefault.bind(this));
    this.app.post('/packages', this.handleSearchPackages.bind(this));
    this.app.delete('/reset', this.handleReset.bind(this));
    this.app.get('/package/:id', this.handleGetPackageById.bind(this));
    this.app.put('/package/:id', this.handleUpdatePackageById.bind(this));
    this.app.delete('/package/:id', this.handleDeletePackageById.bind(this));
    this.app.post('/package', this.handleCreatePackage.bind(this));
    this.app.get('/package/:id/rate', this.handleRatePackage.bind(this));
    this.app.put('/authenticate', this.handleAuthenticateUser.bind(this));
    this.app.get('/package/byName/:name', this.handleGetPackageByName.bind(this));
    this.app.delete('/package/byName/:name', this.handleDeletePackageByName.bind(this));
    this.app.post('/package/byRegEx', this.handleSearchPackagesByRegex.bind(this));
  }

  // Middleware for authentication (placeholder)
  private authenticate(req: Request, res: Response, next: NextFunction) {
    // Check the request path to skip authentication for specific routes
    if (req.path === '/authenticate') {
      next(); // Skip authentication for the /authenticate route
    } else {
      // Skeleton authentication logic (replace with actual logic)
      // For example, you can check for a valid token here
      //validAPI = DataBase.checkAPIKey(api)

      //Should we pass a userPermission to the function called?
      if (true) {
        next(); // Authentication successful
      } else {
        res.status(401).json({ message: 'Authentication failed' });
      }
    }
  }

  private handleDefault(req: Request, res: Response) {
    res.send('Welcome to the package management API!');
  }

  private async handleSearchPackages(req: Request, res: Response) {
    // Skeleton package creation logic (replace with actual logic)
    // You can access request data using req.body
    /**
     * 200	
      List of packages

      400	
      There is missing field(s) in the PackageQuery/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.

      413	
      Too many packages returned.
     */
    const returnPackage = req.body;
    res.status(201).json(returnPackage);
  }


  private async handleCreatePackage(req: Request, res: Response) {
    // Skeleton package creation logic (replace with actual logic)
    // You can access request data using req.body
    //Check for improper stuff 400 code
    /**
     * 201	
      Success. Check the ID in the returned metadata for the official ID
     * 
     * 400	
      There is missing field(s) in the PackageData/AuthenticationToken or it is formed improperly (e.g. Content and URL are both set), or the AuthenticationToken is invalid.

      
      409	
      Package exists already.

      
      424	
      Package is not uploaded due to the disqualified rating.
     */
    try{
        if("URL" in req.body && "Content" in req.body || !("JSProgram" in req.body)){
            res.status(400).json({error: 'There is missing field(s) in the PackageData/AuthenticationToken or it is formed improperly (e.g. Content and URL are both set)'});
        }
        if("URL" in req.body){
            const newPackage = req.body;
            const url: string = newPackage.URL
            const JsProgram: string = newPackage.JsProgram
            const result: object  = await APIHelpPackageURL(url, JsProgram)
            if ('metadata' in result){
              res.status(201).json(result);
            }
            else if ('package already exists' in result){
              res.status(409).json({error: "Package exists already"});
            }
            else {
                res.status(424).json({error: "Package Disqualified Rating"});
            }
        }
        // Content needs progress. Can currently Unzip but don't know how to analyze the metric scores.
        else if("Content" in req.body){
            const base64: string = req.body.Content
            const JSprogram: string = req.body.JsProgram
            const URL: string = await APIHelpPackageContent(base64, JSprogram)
            let result: object = {error: "Package Disqualified Rating"}
            if(URL){
              result = await APIHelpPackageURL(URL, JSprogram)
              console.log(result)
            }
            if ('metadata' in result){
                res.status(201).json(result);
            }
            else if ('package exists' in result){
              res.status(409).json({error: "Package exists already"});
            }
            else {
                res.status(424).json({error: "Package Disqualified Rating"});
            }
        }
        else{
            res.status(400).json({error: 'There is missing field(s)'});
        }
    }
    catch(error){
        res.status(400).json({error: 'There is missing field(s) in the PackageData/AuthenticationToken or it is formed improperly (e.g. Content and URL are both set)'});
    }
  }

  private handleReset(req: Request, res: Response) {
    // Skeleton system reset logic (replace with actual logic)
    // For example, you can clear data or perform other reset actions
    // Respond with a success message
    /**
     * 200	
      Registry is reset.

      400	
      There is missing field(s) in the AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.

      401	
      You do not have permission to reset the registry.
     */
    res.json({ message: 'System reset successfully' });
  }

  private handleGetPackageById(req: Request, res: Response) {
    // Skeleton logic to retrieve a package by ID (replace with actual logic)
    // You can access the ID using req.params.id

    /**
     * 
     * 200	
      Return the package. Content is required.

     * 400	
      There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.

      404	
      Package does not exist.
     */


      const packageId = req.params.id;

      // Check if packageId is provided and is not empty
      if (!packageId) {
          return res.status(400).json({
              error: 'Package ID is missing or invalid.'
          });
      }
  
      // Perform database query or other actions to get the package by ID
      // For demonstration purposes, let's assume you have a packages database and a function getPackageById
      const package_result: object = {}//getPackageById(packageId);
  
      if (!package_result) {
          // Package not found
          return res.status(404).json({
              error: 'Package does not exist.'
          });
      }
  
      // Successfully retrieved the package
      return res.status(200).json(package_result);
  }

  private handleUpdatePackageById(req: Request, res: Response) {
    // Skeleton logic to update a package by ID (replace with actual logic)
    // You can access the ID using req.params.id and data using req.body
    
    /**
     * 200	
      Version is updated.

      400	
      There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.

      404	
      Package does not exist.
     */
    
      const packageId = req.params.id;
      const updatedPackageData = req.body;
  
      // Check for top-level required fields in the request body
      const requiredTopLevelFields = ["metadata", "data"];
      const missingTopLevelFields = requiredTopLevelFields.filter(field => !updatedPackageData[field]);
  
      if (missingTopLevelFields.length > 0) {
          return res.status(400).json({
              error: `Missing required top-level fields: ${missingTopLevelFields.join(', ')}`
          });
      }
  
      // Check for required subfields within 'metadata' and 'data'
      if (updatedPackageData.metadata) {
          const requiredMetadataFields = ["Name", "Version", "ID"];
          const missingMetadataFields = requiredMetadataFields.filter(field => !updatedPackageData.metadata[field]);
  
          if (missingMetadataFields.length > 0) {
              return res.status(400).json({
                  error: `Missing required 'metadata' subfields: ${missingMetadataFields.join(', ')}`
              });
          }
      }
  
      if (updatedPackageData.data) {
          const requiredDataFields = ["Content", "URL", "JSProgram"];
          const missingDataFields = requiredDataFields.filter(field => !updatedPackageData.data[field]);
  
          if (missingDataFields.length > 0) {
              return res.status(400).json({
                  error: `Missing required 'data' subfields: ${missingDataFields.join(', ')}`
              });
          }
      }
  
      // Update the package (replace this with your actual update logic)
      // For demonstration purposes, let's assume you have a packages database and a function updatePackageById
      const updatedPackage: boolean = false //updatePackageById(packageId, updatedPackageData);
  
      if (!updatedPackage) {
          // Package does not exist
          return res.status(404).json({
              error: 'Package not found.'
          });
      }
  
      // Successfully updated package
      return res.status(200).json({
          message: 'Version is updated.',
          updatedPackage
      });
  }

  private handleDeletePackageById(req: Request, res: Response) {
    // Skeleton logic to delete a package by ID (replace with actual logic)
    // You can access the ID using req.params.id
    /**
     * 200	
      Version is deleted.

      400	
      There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.

      404	
      Package does not exist.
     */
    
      const packageId = req.params.id;

      // Check if the package ID is provided
      if (!packageId) {
          return res.status(400).json({
              error: 'Package ID is missing or invalid.'
          });
      }
  
      // Perform database delete or other actions to delete the package
      // For demonstration purposes, let's assume you have a packages database and a function deletePackageById
      const deletedPackage: boolean = false//deletePackageById(packageId);
  
      if (!deletedPackage) {
          // Package does not exist
          return res.status(404).json({
              error: 'Package not found.'
          });
      }
  
      // Successfully deleted package
      return res.status(200).json({
          message: 'Package is deleted successfully.'
      });
  }

  private handleRatePackage(req: Request, res: Response) {
    // Skeleton logic to rate a package by ID (replace with actual logic)
    // You can access the ID using req.params.id

    /**
     * 200	
      Return the rating. Only use this if each metric was computed successfully.
     * 400	
      There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.

      404	
      Package does not exist.

      500	
      The package rating system choked on at least one of the metrics.
     */
      const packageId = req.params.id;
      const ratingData = req.body;
  
      // Check if the package ID is provided
      if (!packageId) {
          return res.status(400).json({
              error: 'Package ID is missing or invalid.'
          });
      }
  
      // Check for required fields in the rating data
      const requiredFields = [
          "BusFactor",
          "Correctness",
          "RampUp",
          "ResponsiveMaintainer",
          "LicenseScore",
          "GoodPinningPractice",
          "PullRequest",
          "NetScore"
      ];
  
      const missingFields = requiredFields.filter(field => typeof ratingData[field] !== 'number');
      if (missingFields.length > 0) {
          return res.status(400).json({
              error: `Missing or invalid rating fields: ${missingFields.join(', ')}`
          });
      }
  
      // Perform rating logic or database updates here
      // For demonstration purposes, let's assume you have a package ratings database and a function ratePackage
      const ratedPackage: object = {}//ratePackage(packageId, ratingData);
  
      if (!ratedPackage) {
          // Package does not exist
          return res.status(404).json({
              error: 'Package not found.'
          });
      }
  
      // Successfully rated package
      return res.status(200).json(ratedPackage);
  }


  private handleAuthenticateUser(req: Request, res: Response) {

    /**
     * 
     * 200	
      Return an AuthenticationToken.

     * 400	
      There is missing field(s) in the AuthenticationRequest or it is formed improperly.

      401	
      The user or password is invalid.

      501	
      This system does not support authentication.
     */

    const secretKey: string = 'ECE461'
    try {
      const username: string = req.body.User.name;
      const isAdmin: boolean = req.body.User.isAdmin;
      const password: string = req.body.Secret.password;
      if(!username || !password || req.body.User.isAdmin == null){
        res.status(400).json({ error: 'Missing Fields' });
        return;
      }
      // Implement your actual user authentication logic here
      const isValidUser = authenticateUser(username, password);
      
      //Temporary 'Base Case' Authentication
      if (isValidUser) {
        // Create the user object to include in the JWT token
        const userObj =req.body.User
         /**
          *  {
          username: username,
          isAdmin: isAdmin,
        };
          */
  
        // Sign the JWT token
        const token = jwt.sign(userObj, secretKey, { expiresIn: '10h' });
  
        // Return the token in the "Bearer" format
        res.status(200).send(`"bearer ${token}"`);
      } else {
        res.status(401).json({ error: 'User or Password is invalid' });
      }
    } catch (error) {
      res.status(400).json({ error: 'Missing Fields' });
    }
  }

  private handleGetPackageByName(req: Request, res: Response) {
    // Skeleton logic to retrieve a package by name (replace with actual logic)
    // You can access the name using req.params.name

     /**
     * 
     * 200	
      Return the package history.

     * 400	
      There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.

      404	
      Package does not exist.
     */

      const packageName = req.params.name;

      // Check if the package name is provided
      if (!packageName) {
          return res.status(400).json({
              error: 'Package name is missing or invalid.'
          });
      }
  
      // Perform a database query or other actions to retrieve the package history by name
      // For demonstration purposes, let's assume you have a packages database and a function getPackageByName
      const packageHistory: object = {}//getPackageByName(packageName);
  
      if (!packageHistory) {
          // Package does not exist
          return res.status(404).json({
              error: 'Package not found.'
          });
      }
  
      // Successfully retrieved package history
      return res.status(200).json(packageHistory);
  }

  private handleDeletePackageByName(req: Request, res: Response) {
    // Skeleton logic to delete a package by name (replace with actual logic)
    // You can access the name using req.params.name

         /**
     * 
     * 200	
      Package is deleted.

     * 400	
      There is missing field(s) in the PackageID/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.

      404	
      Package does not exist.
     */
      const packageName = req.params.name;

      // Check if the package name is provided
      if (!packageName) {
          return res.status(400).json({
              error: 'Package name is missing or invalid.'
          });
      }
  
      // Perform database delete or other actions to delete the package by name
      // For demonstration purposes, let's assume you have a packages database and a function deletePackageByName
      const deletedPackage: boolean = false//deletePackageByName(packageName);
  
      if (!deletedPackage) {
          // Package does not exist
          return res.status(404).json({
              error: 'Package not found.'
          });
      }
  
      // Successfully deleted package
      return res.status(200).json({
          message: 'Package is deleted successfully.'
      });
  }

  private handleSearchPackagesByRegex(req: Request, res: Response) {
    // Skeleton logic to search packages by regex (replace with actual logic)
    // You can access the search parameters using req.body

    /**
     * 
     * 200	
      Return a list of packages.

     * 400	
      There is missing field(s) in the PackageRegEx/AuthenticationToken or it is formed improperly, or the AuthenticationToken is invalid.

      404	
      No package found under this regex.
     */

      const regexPattern = req.body.RegEx; // The property should match the name in the request body

      // Check if the regex pattern is provided
      if (!regexPattern) {
          return res.status(400).json({
              error: 'Regular expression pattern is missing.'
          });
      }
  
      // Perform a search using the regex pattern
      // For demonstration purposes, let's assume you have a packages database and a function searchPackagesByRegex
      const searchResults: object[] = []//searchPackagesByRegex(regexPattern);
  
      if (searchResults.length === 0) {
          // No packages found matching the regex
          return res.status(404).json({
              error: 'No package found under this regex.'
          });
      }
  
      // Successfully retrieved search results
      return res.status(200).json(searchResults);
  }

  start(port: number) {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}

const apiServer = new PackageManagementAPI();
apiServer.start(3000);
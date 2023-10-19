import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import {APIHelpPackageContent, APIHelpPackageURL} from './server_helper'
// Example Request: curl -X POST -H "Content-Type: application/json" -d 
//'{"name": "Sample Package", "version": "1.0.0", "data": {"URL": "https://example.com/package.zip"}}' http://localhost:3000/packages
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
    // Skeleton authentication logic (replace with actual logic)
    // For example, you can check for a valid token here
    if (true) {
      next(); // Authentication successful
    } else {
      res.status(401).json({ message: 'Authentication failed' });
    }
  }

  private handleDefault(req: Request, res: Response) {
    res.send('Welcome to the package management API!');
  }

  private async handleSearchPackages(req: Request, res: Response) {
    // Skeleton package creation logic (replace with actual logic)
    // You can access request data using req.body
    const returnPackage = req.body;
    res.status(201).json(returnPackage);
  }


  private async handleCreatePackage(req: Request, res: Response) {
    // Skeleton package creation logic (replace with actual logic)
    // You can access request data using req.body
    //Check for improper stuff 400 code
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
            else{
                res.status(404).json(result);
            }
        }
        else if("Content" in req.body){
            const base64: string = req.body.Content
            const JSprogram: string = req.body.JsProgram
            const result: object = await APIHelpPackageContent(base64, JSprogram)
            if ('success' in result){
                res.status(201).json(result);
            }
            else{
                res.status(404).json({error: "Package Disqualified Rating"});
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
    res.json({ message: 'System reset successfully' });
  }

  private handleGetPackageById(req: Request, res: Response) {
    // Skeleton logic to retrieve a package by ID (replace with actual logic)
    // You can access the ID using req.params.id
    const packageId = req.params.id;
    // Perform database query or other actions to get the package by ID
    // Respond with the package data or a not found message
    res.status(201).json({ success: req.params.id });
    //res.status(404).json({ error: 'Package not found' });
  }

  private handleUpdatePackageById(req: Request, res: Response) {
    // Skeleton logic to update a package by ID (replace with actual logic)
    // You can access the ID using req.params.id and data using req.body
    const packageId = req.params.id;
    const updatedPackageData = req.body;
    // Perform database update or other actions to update the package
    // Respond with the updated package data
    res.status(404).json({ error: 'Package not found' });
  }

  private handleDeletePackageById(req: Request, res: Response) {
    // Skeleton logic to delete a package by ID (replace with actual logic)
    // You can access the ID using req.params.id
    const packageId = req.params.id;
    // Perform database delete or other actions to delete the package
    // Respond with a success message or an error message
    res.json({ message: 'Package deleted successfully' });
  }

  private handleRatePackage(req: Request, res: Response) {
    // Skeleton logic to rate a package by ID (replace with actual logic)
    // You can access the ID using req.params.id
    const packageId = req.params.id;
    // Perform rating logic or database updates here
    // Respond with a success message or an error message
    res.json({ message: 'Package rated successfully' });
  }

  private handleAuthenticateUser(req: Request, res: Response) {
    // Skeleton user authentication logic (replace with actual logic)
    // Implement user authentication here, issue tokens, etc.
    res.json({ message: 'User authenticated successfully' });
  }

  private handleGetPackageByName(req: Request, res: Response) {
    // Skeleton logic to retrieve a package by name (replace with actual logic)
    // You can access the name using req.params.name
    const packageName = req.params.name;
    // Perform database query or other actions to get the package by name
    // Respond with the package data or a not found message
    res.status(404).json({ error: 'Package not found' });
  }

  private handleDeletePackageByName(req: Request, res: Response) {
    // Skeleton logic to delete a package by name (replace with actual logic)
    // You can access the name using req.params.name
    const packageName = req.params.name;
    // Perform database delete or other actions to delete the package by name
    // Respond with a success message or an error message
    res.json({ message: 'Package deleted successfully' });
  }

  private handleSearchPackagesByRegex(req: Request, res: Response) {
    // Skeleton logic to search packages by regex (replace with actual logic)
    // You can access the search parameters using req.body
    const regexPattern = req.body.pattern;
    // Perform a search using the regex pattern
    // Respond with the search results or an error message
    res.json({ message: 'Regex search results' });
  }

  start(port: number) {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}

const apiServer = new PackageManagementAPI();
apiServer.start(3000);
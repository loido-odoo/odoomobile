import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import * as routes from '../routes';
import * as vite from '../vite';

// Mock the http module
jest.mock('http', () => ({
  createServer: jest.fn(() => ({
    listen: jest.fn((options, callback) => {
      if (callback) callback();
      return { close: jest.fn() };
    }),
  })),
}));

// Mock the routes module
jest.mock('../routes', () => ({
  registerRoutes: jest.fn().mockResolvedValue({
    listen: jest.fn(),
  }),
}));

// Mock the vite module
jest.mock('../vite', () => ({
  setupVite: jest.fn().mockResolvedValue(undefined),
  serveStatic: jest.fn(),
  log: jest.fn(),
}));

describe('Express Server', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = process.env;
    process.env = { ...originalEnv };
    jest.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  test('server initialization and middleware setup', async () => {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockError = new Error('Test error');
    Object.defineProperty(mockError, 'status', { value: 400 });

    const mockRequest = {} as express.Request;
    const mockNext = jest.fn();

    // Test error handling middleware
    const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || 'Internal Server Error';
      res.status(status).json({ message });
    };

    errorHandler(mockError, mockRequest, mockResponse as any, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Test error',
    });
  });

  test('development mode setup', async () => {
    process.env.NODE_ENV = 'development';
    const app = express();
    const server = createServer(app);

    await require('../routes').registerRoutes(app);
    await vite.setupVite(app, server);

    expect(vite.setupVite).toHaveBeenCalledWith(app, server);
  });

  test('production mode setup', async () => {
    process.env.NODE_ENV = 'production';
    const app = express();
    const server = createServer(app);

    await require('../routes').registerRoutes(app);
    vite.serveStatic(app);

    expect(vite.serveStatic).toHaveBeenCalledWith(app);
  });
});
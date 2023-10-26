import { createGroup } from './group.controller';
import { AppDataSource } from "../database"; 

jest.mock('../database'); // Esto "mockea" tu módulo de base de datos

describe('Group Controller', () => {
  
  describe('createGroup', () => {
    let mockReq: any;
    let mockRes: any;

    beforeEach(() => {
      // Esto establece tus objetos ficticios (mock) de Request y Response antes de cada prueba
      mockReq = {
        body: {
          name: 'Test Group',
          // ... otros campos requeridos para crear un grupo
        },
      };
      mockRes = {
        status: jest.fn().mockReturnThis(), // esto es para permitir el encadenamiento como res.status(500).send('error')
        send: jest.fn(),
      };
    });

    it('should create a group successfully', async () => {
        // Aquí, "simulas" lo que tu función de base de datos debe devolver
        (AppDataSource.manager.find as jest.Mock).mockResolvedValueOnce([
            /* simula aquí lo que esperarías que devuelva tu base de datos cuando buscas usuarios por walletAddress */
        ]);
    
        await createGroup(mockReq, mockRes);
    
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.send).toHaveBeenCalledWith(expect.objectContaining({
            message: "Group created Succesfully",
        }));
    });

    // ... otras pruebas para createGroup ...

  });

  // ... pruebas para updateGnosisSafeAddress, getUserGroups, etc ...
  
});

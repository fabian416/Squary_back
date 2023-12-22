'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
const group_controller_1 = require('./group.controller');
const database_1 = require('../database');
jest.mock('../database'); // Esto "mockea" tu módulo de base de datos
describe('Group Controller', () => {
  describe('createGroup', () => {
    let mockReq;
    let mockRes;
    beforeEach(() => {
      // Esto establece tus objetos ficticios (mock) de Request y Response antes de cada prueba
      mockReq = {
        body: {
          name: 'Test Group',
          // ... otros campos requeridos para crear un grupo
        },
      };
      mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
    });
    it('should create a group successfully', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        // Aquí, "simulas" lo que tu función de base de datos debe devolver
        database_1.AppDataSource.manager.find.mockResolvedValueOnce([
          /* simula aquí lo que esperarías que devuelva tu base de datos cuando buscas usuarios por walletAddress */
        ]);
        yield (0, group_controller_1.createGroup)(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.send).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'Group created Succesfully',
          })
        );
      }));
    // ... otras pruebas para createGroup ...
  });
  // ... pruebas para updateGnosisSafeAddress, getUserGroups, etc ...
});

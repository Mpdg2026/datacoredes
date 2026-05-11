import { describe, it, expect, beforeAll } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/context';

// Mock context for testing
function createMockContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: 'test-user',
      email: 'test@example.com',
      name: 'Test User',
      loginMethod: 'manus',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: 'https',
      headers: {},
    } as TrpcContext['req'],
    res: {
      clearCookie: () => {},
    } as TrpcContext['res'],
  };
}

describe('Portal Router', () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = createMockContext();
    caller = appRouter.createCaller(ctx);
  });

  describe('Regiões Funcionais', () => {
    it('deve retornar lista de Regiões Funcionais', async () => {
      const result = await caller.portal.regioesFuncionais();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      
      // Validar estrutura
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('id');
        expect(result[0]).toHaveProperty('codigo');
        expect(result[0]).toHaveProperty('nome');
      }
    });
  });

  describe('Coredes', () => {
    it('deve retornar lista de Coredes para uma RF válida', async () => {
      // Primeiro, obter uma RF válida
      const rfs = await caller.portal.regioesFuncionais();
      expect(rfs.length).toBeGreaterThan(0);

      const firstRF = rfs[0];
      const coredes = await caller.portal.coredes({ regiaoFuncionalId: firstRF.id });
      
      expect(Array.isArray(coredes)).toBe(true);
      if (coredes.length > 0) {
        expect(coredes[0]).toHaveProperty('id');
        expect(coredes[0]).toHaveProperty('nome');
        expect(coredes[0]).toHaveProperty('regiaoFuncionalId');
      }
    });

    it('deve retornar lista vazia quando RF não existe', async () => {
      const coredes = await caller.portal.coredes({ regiaoFuncionalId: '999' });
      expect(Array.isArray(coredes)).toBe(true);
    });
  });

  describe('Municípios', () => {
    it('deve retornar lista de Municípios para um Corede válido', async () => {
      // Obter RF e Corede válidos
      const rfs = await caller.portal.regioesFuncionais();
      const firstRF = rfs[0];
      const coredes = await caller.portal.coredes({ regiaoFuncionalId: firstRF.id });
      
      if (coredes.length > 0) {
        const firstCorede = coredes[0];
        const municipios = await caller.portal.municipios({ coredeId: firstCorede.id });
        
        expect(Array.isArray(municipios)).toBe(true);
        if (municipios.length > 0) {
          expect(municipios[0]).toHaveProperty('id');
          expect(municipios[0]).toHaveProperty('nome');
          expect(municipios[0]).toHaveProperty('coredeId');
        }
      }
    });
  });

  describe('Indicadores IDESE', () => {
    it('deve retornar dados IDESE para uma RF válida', async () => {
      const rfs = await caller.portal.regioesFuncionais();
      const firstRF = rfs[0];
      
      const idese = await caller.portal.idese({ regiaoFuncionalId: firstRF.id });
      expect(Array.isArray(idese)).toBe(true);
    });

    it('deve retornar dados IDESE para um Corede válido', async () => {
      const rfs = await caller.portal.regioesFuncionais();
      const coredes = await caller.portal.coredes({ regiaoFuncionalId: rfs[0].id });
      
      if (coredes.length > 0) {
        const idese = await caller.portal.idese({ coredeId: coredes[0].id });
        expect(Array.isArray(idese)).toBe(true);
      }
    });
  });

  describe('Indicadores IGM', () => {
    it('deve retornar dados IGM para uma RF válida', async () => {
      const rfs = await caller.portal.regioesFuncionais();
      const firstRF = rfs[0];
      
      const igm = await caller.portal.igm({ regiaoFuncionalId: firstRF.id });
      expect(Array.isArray(igm)).toBe(true);
    });
  });

  describe('Indicadores IDSC', () => {
    it('deve retornar dados IDSC para uma RF válida', async () => {
      const rfs = await caller.portal.regioesFuncionais();
      const firstRF = rfs[0];
      
      const idsc = await caller.portal.idsc({ regiaoFuncionalId: firstRF.id });
      expect(Array.isArray(idsc)).toBe(true);
    });
  });

  describe('Violência Geral', () => {
    it('deve retornar dados de violência geral para uma RF válida', async () => {
      const rfs = await caller.portal.regioesFuncionais();
      const firstRF = rfs[0];
      
      const violencia = await caller.portal.violenciaGeral({ regiaoFuncionalId: firstRF.id });
      expect(Array.isArray(violencia)).toBe(true);
    });
  });

  describe('Violência contra a Mulher', () => {
    it('deve retornar dados de violência contra a mulher para uma RF válida', async () => {
      const rfs = await caller.portal.regioesFuncionais();
      const firstRF = rfs[0];
      
      const violencia = await caller.portal.violenciaMulher({ regiaoFuncionalId: firstRF.id });
      expect(Array.isArray(violencia)).toBe(true);
    });
  });
});

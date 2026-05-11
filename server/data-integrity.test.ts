import { describe, it, expect, beforeAll } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/context';

function createMockContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: 'https',
      headers: {},
    } as TrpcContext['req'],
    res: {} as TrpcContext['res'],
  };
}

describe('Data Integrity Validation', () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = createMockContext();
    caller = appRouter.createCaller(ctx);
  });

  describe('Hierarquia Territorial', () => {
    it('deve ter exatamente 9 Regiões Funcionais', async () => {
      const rfs = await caller.portal.regioesFuncionais();
      expect(rfs).toHaveLength(9);
    });

    it('deve ter exatamente 28 Coredes', async () => {
      const rfs = await caller.portal.regioesFuncionais();
      let totalCoredes = 0;
      
      for (const rf of rfs) {
        const coredes = await caller.portal.coredes({ regiaoFuncionalId: rf.id });
        totalCoredes += coredes.length;
      }
      
      expect(totalCoredes).toBe(28);
    });

    it('deve ter exatamente 497 Municípios', async () => {
      const rfs = await caller.portal.regioesFuncionais();
      let totalMunicipios = 0;
      
      for (const rf of rfs) {
        const coredes = await caller.portal.coredes({ regiaoFuncionalId: rf.id });
        for (const corede of coredes) {
          const municipios = await caller.portal.municipios({ 
            regiaoFuncionalId: rf.id,
            coredeId: corede.id 
          });
          totalMunicipios += municipios.length;
        }
      }
      
      expect(totalMunicipios).toBe(497);
    });
  });

  describe('Integridade de Dados', () => {
    it('cada RF deve ter Coredes associadas', async () => {
      const rfs = await caller.portal.regioesFuncionais();
      
      for (const rf of rfs) {
        const coredes = await caller.portal.coredes({ regiaoFuncionalId: rf.id });
        expect(coredes.length).toBeGreaterThan(0);
      }
    });

    it('cada Corede deve ter Municípios associados', async () => {
      const rfs = await caller.portal.regioesFuncionais();
      
      for (const rf of rfs) {
        const coredes = await caller.portal.coredes({ regiaoFuncionalId: rf.id });
        for (const corede of coredes) {
          const municipios = await caller.portal.municipios({ 
            regiaoFuncionalId: rf.id,
            coredeId: corede.id 
          });
          expect(municipios.length).toBeGreaterThan(0);
        }
      }
    });

    it('Regiões Funcionais devem ter IDs válidos', async () => {
      const rfs = await caller.portal.regioesFuncionais();
      
      for (const rf of rfs) {
        expect(rf.id).toBeDefined();
        expect(rf.codigo).toBeDefined();
        expect(rf.nome).toBeDefined();
        expect(typeof rf.id).toBe('string');
      }
    });

    it('Coredes devem ter regiaoFuncionalId válido', async () => {
      const rfs = await caller.portal.regioesFuncionais();
      const validRFIds = new Set(rfs.map(rf => rf.id));
      
      for (const rf of rfs) {
        const coredes = await caller.portal.coredes({ regiaoFuncionalId: rf.id });
        for (const corede of coredes) {
          expect(validRFIds.has(corede.regiaoFuncionalId)).toBe(true);
        }
      }
    });

    it('Municípios devem ter coredeId válido', async () => {
      const rfs = await caller.portal.regioesFuncionais();
      const validCoredeIds = new Set<number>();
      
      for (const rf of rfs) {
        const coredes = await caller.portal.coredes({ regiaoFuncionalId: rf.id });
        coredes.forEach(c => validCoredeIds.add(c.id));
      }
      
      for (const rf of rfs) {
        const coredes = await caller.portal.coredes({ regiaoFuncionalId: rf.id });
        for (const corede of coredes) {
          const municipios = await caller.portal.municipios({ coredeId: corede.id });
          for (const municipio of municipios) {
            expect(validCoredeIds.has(municipio.coredeId)).toBe(true);
          }
        }
      }
    });
  });
});

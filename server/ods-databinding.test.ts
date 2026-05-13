import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";

describe("ODS Data Binding", () => {
  it("deve retornar dados ODS para um município válido", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    // Camaquã tem código IBGE 4302505
    const result = await caller.portal.ods({ codigoIBGE: 4302505 });

    expect(result).toBeDefined();
    if (result) {
      expect(result).toHaveProperty("municipio");
      expect(result).toHaveProperty("anos");
      expect(result.anos).toHaveProperty("2023");
      expect(result.anos).toHaveProperty("2024");
      expect(result.anos).toHaveProperty("2025");
    }
  });

  it("deve retornar null para código IBGE não fornecido", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.portal.ods({});
    expect(result).toBeNull();
  });

  it("deve retornar null para código IBGE inválido", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.portal.ods({ codigoIBGE: 9999999 });
    expect(result).toBeNull();
  });

  it("deve manter série histórica consistente", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.portal.ods({ codigoIBGE: 4302505 });

    // Verificar que a série histórica está presente
    if (result) {
      expect(
        result.anos["2023"] || result.anos["2024"] || result.anos["2025"]
      ).toBeDefined();

      // Verificar que cada ano tem estrutura correta
      Object.values(result.anos).forEach((ano: any) => {
        if (ano) {
          expect(ano).toHaveProperty("pontuacao");
          expect(ano).toHaveProperty("classificacao");
          expect(ano).toHaveProperty("goals");
        }
      });
    }
  });
});

import { beforeEach, describe, expect, it } from "vitest";

import { useCartDrawerStore } from "@/stores/useCartDrawerStore";

describe("useCartDrawerStore", () => {
  beforeEach(() => {
    useCartDrawerStore.setState({ isOpen: false });
  });

  it("inicia cerrado", () => {
    expect(useCartDrawerStore.getState().isOpen).toBe(false);
  });

  it("open() abre el drawer", () => {
    useCartDrawerStore.getState().open();

    expect(useCartDrawerStore.getState().isOpen).toBe(true);
  });

  it("close() cierra el drawer", () => {
    useCartDrawerStore.getState().open();
    useCartDrawerStore.getState().close();

    expect(useCartDrawerStore.getState().isOpen).toBe(false);
  });

  it("toggle() invierte el estado en ambas direcciones", () => {
    useCartDrawerStore.getState().toggle();
    expect(useCartDrawerStore.getState().isOpen).toBe(true);

    useCartDrawerStore.getState().toggle();
    expect(useCartDrawerStore.getState().isOpen).toBe(false);
  });
});
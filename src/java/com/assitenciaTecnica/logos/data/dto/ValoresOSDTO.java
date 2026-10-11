package com.assitenciaTecnica.logos.data.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/** Corpo de PATCH /api/ordens-servico/v1/{id}/valores. */
@JsonIgnoreProperties(ignoreUnknown = true)
public class ValoresOSDTO {

    private Double valorMaoDeObra;
    // true = recalcula o valor da OS como (soma das peças + mão de obra).
    private boolean aplicarTotal;

    public Double getValorMaoDeObra() { return valorMaoDeObra; }
    public void setValorMaoDeObra(Double valorMaoDeObra) { this.valorMaoDeObra = valorMaoDeObra; }

    public boolean isAplicarTotal() { return aplicarTotal; }
    public void setAplicarTotal(boolean aplicarTotal) { this.aplicarTotal = aplicarTotal; }
}

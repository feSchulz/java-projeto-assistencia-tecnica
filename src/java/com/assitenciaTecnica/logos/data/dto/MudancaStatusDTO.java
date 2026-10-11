package com.assitenciaTecnica.logos.data.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Corpo de PATCH /api/ordens-servico/v1/{id}/status.
 * Só {@code status} é obrigatório (nome do enum, ex.: "EM_ANDAMENTO").
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class MudancaStatusDTO {

    private String status;
    private String observacao;
    // Usado ao ir para ORCAMENTO / AGUARDANDO_APROVACAO.
    private Double valorOrcado;
    // Usado ao concluir a OS (dias de garantia; 0 ou vazio = sem garantia).
    private Integer garantiaDias;

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getObservacao() { return observacao; }
    public void setObservacao(String observacao) { this.observacao = observacao; }

    public Double getValorOrcado() { return valorOrcado; }
    public void setValorOrcado(Double valorOrcado) { this.valorOrcado = valorOrcado; }

    public Integer getGarantiaDias() { return garantiaDias; }
    public void setGarantiaDias(Integer garantiaDias) { this.garantiaDias = garantiaDias; }
}

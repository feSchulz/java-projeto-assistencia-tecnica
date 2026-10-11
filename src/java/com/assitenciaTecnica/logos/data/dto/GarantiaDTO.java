package com.assitenciaTecnica.logos.data.dto;

import java.util.GregorianCalendar;

/** Garantia ainda em vigor de uma OS concluída anteriormente para o mesmo equipamento. */
public class GarantiaDTO {

    private Long ordemServicoId;
    private GregorianCalendar dataConclusao;
    private Integer garantiaDias;
    private GregorianCalendar fimGarantia;

    public Long getOrdemServicoId() { return ordemServicoId; }
    public void setOrdemServicoId(Long ordemServicoId) { this.ordemServicoId = ordemServicoId; }

    public GregorianCalendar getDataConclusao() { return dataConclusao; }
    public void setDataConclusao(GregorianCalendar dataConclusao) { this.dataConclusao = dataConclusao; }

    public Integer getGarantiaDias() { return garantiaDias; }
    public void setGarantiaDias(Integer garantiaDias) { this.garantiaDias = garantiaDias; }

    public GregorianCalendar getFimGarantia() { return fimGarantia; }
    public void setFimGarantia(GregorianCalendar fimGarantia) { this.fimGarantia = fimGarantia; }
}

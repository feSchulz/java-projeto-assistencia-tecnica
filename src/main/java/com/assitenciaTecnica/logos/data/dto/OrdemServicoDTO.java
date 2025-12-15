package com.assitenciaTecnica.logos.data.dto;


import java.util.GregorianCalendar;
import com.assitenciaTecnica.logos.model.Cliente;
import com.assitenciaTecnica.logos.model.Equipamento;
import com.assitenciaTecnica.logos.model.Funcionario;
import com.assitenciaTecnica.logos.model.enums.StatusOrdemServico;

public class OrdemServicoDTO {

    private Long id;
    private String descricaoCliente;
    private String descricaoTecnico;
    private GregorianCalendar dataAbertura;
    private GregorianCalendar prazoConclusao;
    private  GregorianCalendar dataConclusao;
    private Double valor;
    private Equipamento equipamento;
    private Cliente cliente;
    private Funcionario funcionarioResponsavel;
    private Long status;

    public StatusOrdemServico getStatus() {
        return StatusOrdemServico.fromCodigo(status);
    }

    public void setStatus(StatusOrdemServico status) {
        this.status = status.getCodigo();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescricaoCliente() {
        return descricaoCliente;
    }

    public void setDescricaoCliente(String descricaoCliente) {
        this.descricaoCliente = descricaoCliente;
    }

    public String getDescricaoTecnico() {
        return descricaoTecnico;
    }

    public void setDescricaoTecnico(String descricaoTecnico) {
        this.descricaoTecnico = descricaoTecnico;
    }

    public GregorianCalendar getDataAbertura() {
        return dataAbertura;
    }

    public void setDataAbertura(GregorianCalendar dataAbertura) {
        this.dataAbertura = dataAbertura;
    }

    public GregorianCalendar getPrazoConclusao() {
        return prazoConclusao;
    }

    public void setPrazoConclusao(GregorianCalendar prazoConclusao) {
        this.prazoConclusao = prazoConclusao;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Funcionario getFuncionarioResponsavel() {
        return funcionarioResponsavel;
    }

    public void setFuncionarioResponsavel(Funcionario funcionarioResponsavel) {
        this.funcionarioResponsavel = funcionarioResponsavel;
    }

    public Equipamento getEquipamento() {
        return equipamento;
    }

    public void setEquipamento(Equipamento equipamento) {
        this.equipamento = equipamento;
    }

    public GregorianCalendar getDataConclusao() {
        return dataConclusao;
    }

    public void setDataConclusao(GregorianCalendar dataConclusao) {
        this.dataConclusao = dataConclusao;
    }
}

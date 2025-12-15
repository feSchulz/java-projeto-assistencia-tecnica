package com.assitenciaTecnica.logos.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.GregorianCalendar;
import com.assitenciaTecnica.logos.model.enums.StatusOrdemServico;

@Entity
@Table(name="ordemservico")
public class OrdemServico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String descricaoCliente;
    @Column(nullable = false)
    private String descricaoTecnico;
    @Column(nullable = false)
    private GregorianCalendar dataAbertura;
    @Column(nullable = false)
    private GregorianCalendar prazoConclusao;
    @Column(nullable = false)
    private  GregorianCalendar dataConclusao;
    @Column(nullable = false)
    private Double valor;
    @ManyToOne
    @JoinColumn(name = "equipamento_id", nullable = false)
    private Equipamento equipamento;
    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;
    @ManyToOne
    @JoinColumn(name = "funcionario_id", nullable = false)
    private Funcionario funcionarioResponsavel;

    @Column(nullable = false)
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

package com.assitenciaTecnica.logos.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import com.assitenciaTecnica.logos.model.enums.StatusMaterial;


@Entity
@Table(name = "peca_ordem_servico")
public class PecaOrdemServico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "ordem_servico_id")
    private OrdemServico ordemServico;
    @ManyToOne(optional = false)
    @JoinColumn(name = "material_id")
    private MaterialEstoque material;
    @Column(nullable = false)
    private Integer quantidade;
    @Column(nullable = false)
    private BigDecimal valorUnitario;
    @Column(nullable = false)
    private BigDecimal valorTotal;
    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private StatusMaterial status;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public MaterialEstoque getMaterial() {
        return material;
    }

    public void setMaterial(MaterialEstoque material) {
        this.material = material;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public BigDecimal getValorUnitario() {
        return valorUnitario;
    }

    public void setValorUnitario(BigDecimal valorUnitario) {
        this.valorUnitario = valorUnitario;
    }

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }

    public StatusMaterial getStatus() {
        return status;
    }

    public void setStatus(StatusMaterial status) {
        this.status = status;
    }

    public OrdemServico getOrdemServico() {
        return ordemServico;
    }

    public void setOrdemServico(OrdemServico ordemServico) {
        this.ordemServico = ordemServico;
    }
}

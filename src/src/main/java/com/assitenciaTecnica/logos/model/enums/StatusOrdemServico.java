package com.assitenciaTecnica.logos.model.enums;

import java.util.EnumSet;
import java.util.Set;

/**
 * Status de uma ordem de serviço.
 *
 * Os códigos 0..3 já existiam e continuam iguais (há OS gravadas com eles).
 * Os códigos 4..6 (orçamento/aprovação) foram acrescentados depois, sem
 * mudar nenhum dos anteriores.
 *
 * Fluxo permitido (ver {@link #podeIrPara}):
 *   ABERTA -> ORCAMENTO | EM_ANDAMENTO | CANCELADA
 *   ORCAMENTO -> AGUARDANDO_APROVACAO | CANCELADA
 *   AGUARDANDO_APROVACAO -> APROVADA | ORCAMENTO | CANCELADA
 *   APROVADA -> EM_ANDAMENTO | CANCELADA
 *   EM_ANDAMENTO -> CONCLUIDA | CANCELADA
 *   CONCLUIDA -> EM_ANDAMENTO            (retorno / garantia)
 *   CANCELADA -> ABERTA                  (reabrir)
 * O orçamento é opcional: ABERTA pode ir direto para EM_ANDAMENTO.
 */
public enum StatusOrdemServico {
    ABERTA(0L),
    EM_ANDAMENTO(1L),
    CONCLUIDA(2L),
    CANCELADA(3L),
    ORCAMENTO(4L),
    AGUARDANDO_APROVACAO(5L),
    APROVADA(6L);

    private final Long codigo;

    StatusOrdemServico(Long codigo) {
        this.codigo = codigo;
    }

    public Long getCodigo() {
        return codigo;
    }

    public static StatusOrdemServico fromCodigo(Long codigo) {
        for (StatusOrdemServico status : StatusOrdemServico.values()) {
            if (status.getCodigo().equals(codigo)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Código inválido para StatusOrdemServico: " + codigo);
    }

    /** Concluída ou cancelada: a OS não está mais em andamento. */
    public boolean isFinalizada() {
        return this == CONCLUIDA || this == CANCELADA;
    }

    public Set<StatusOrdemServico> proximosPermitidos() {
        switch (this) {
            case ABERTA:
                return EnumSet.of(ORCAMENTO, EM_ANDAMENTO, CANCELADA);
            case ORCAMENTO:
                return EnumSet.of(AGUARDANDO_APROVACAO, CANCELADA);
            case AGUARDANDO_APROVACAO:
                return EnumSet.of(APROVADA, ORCAMENTO, CANCELADA);
            case APROVADA:
                return EnumSet.of(EM_ANDAMENTO, CANCELADA);
            case EM_ANDAMENTO:
                return EnumSet.of(CONCLUIDA, CANCELADA);
            case CONCLUIDA:
                return EnumSet.of(EM_ANDAMENTO);
            case CANCELADA:
                return EnumSet.of(ABERTA);
            default:
                return EnumSet.noneOf(StatusOrdemServico.class);
        }
    }

    public boolean podeIrPara(StatusOrdemServico destino) {
        return proximosPermitidos().contains(destino);
    }
}

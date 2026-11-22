package com.assitenciaTecnica.logos.data.dto;

import java.util.List;
import org.springframework.data.domain.Page;

/**
 * Resposta paginada genérica das listas (clientes, equipamentos, materiais,
 * ordens de serviço, auditoria). {@code page} começa em 0.
 */
public class PaginaDTO<T> {

    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;

    public static final int TAMANHO_MAXIMO = 100;

    public static <T> PaginaDTO<T> de(Page<?> origem, List<T> conteudo) {
        PaginaDTO<T> dto = new PaginaDTO<>();
        dto.content = conteudo;
        dto.page = origem.getNumber();
        dto.size = origem.getSize();
        dto.totalElements = origem.getTotalElements();
        dto.totalPages = origem.getTotalPages();
        return dto;
    }

    /** Evita páginas negativas ou gigantes vindas da URL. */
    public static int paginaSegura(int page) {
        return Math.max(page, 0);
    }

    public static int tamanhoSeguro(int size) {
        if (size < 1) return 10;
        return Math.min(size, TAMANHO_MAXIMO);
    }

    /** Texto de busca sem nulos/espaços sobrando (as consultas esperam "" e não null). */
    public static String textoBusca(String q) {
        return q == null ? "" : q.trim();
    }

    public static String soDigitos(String q) {
        return q == null ? "" : q.replaceAll("\\D", "");
    }

    public List<T> getContent() { return content; }
    public void setContent(List<T> content) { this.content = content; }

    public int getPage() { return page; }
    public void setPage(int page) { this.page = page; }

    public int getSize() { return size; }
    public void setSize(int size) { this.size = size; }

    public long getTotalElements() { return totalElements; }
    public void setTotalElements(long totalElements) { this.totalElements = totalElements; }

    public int getTotalPages() { return totalPages; }
    public void setTotalPages(int totalPages) { this.totalPages = totalPages; }
}

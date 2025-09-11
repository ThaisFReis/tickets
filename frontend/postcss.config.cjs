module.exports = {
  plugins: {
    'tailwindcss/nesting': {}, // Adicionado para melhor compatibilidade
    tailwindcss: {},          // Carrega o tailwindcss com sua configuração
    autoprefixer: {},         // Mantém o autoprefixer
  },
}
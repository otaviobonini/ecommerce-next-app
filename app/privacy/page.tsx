export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Política de Privacidade</h1>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Introdução</h2>
          <p>
            Esta Política de Privacidade explica como coletamos, utilizamos e
            protegemos as informações fornecidas pelos usuários ao utilizar
            nossa loja virtual.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            2. Informações Coletadas
          </h2>
          <p>
            Podemos coletar informações fornecidas diretamente pelo usuário
            durante o cadastro, compra ou contato conosco, incluindo:
          </p>

          <ul className="list-disc pl-6 mt-3 space-y-1">
            <li>Nome completo;</li>
            <li>Endereço de e-mail;</li>
            <li>Número de telefone;</li>
            <li>Endereço para entrega;</li>
            <li>Histórico de pedidos.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            3. Uso das Informações
          </h2>
          <p>As informações coletadas podem ser utilizadas para:</p>

          <ul className="list-disc pl-6 mt-3 space-y-1">
            <li>Processar pedidos e pagamentos;</li>
            <li>Realizar entregas;</li>
            <li>Fornecer suporte ao cliente;</li>
            <li>Enviar atualizações sobre pedidos;</li>
            <li>Melhorar nossos serviços e experiência do usuário.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            4. Compartilhamento de Dados
          </h2>
          <p>
            Não vendemos informações pessoais dos usuários. Os dados poderão ser
            compartilhados apenas com parceiros essenciais para a operação da
            loja, como processadores de pagamento, transportadoras e prestadores
            de serviços tecnológicos.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Segurança</h2>
          <p>
            Adotamos medidas técnicas e organizacionais para proteger os dados
            pessoais contra acessos não autorizados, perda, alteração ou
            divulgação indevida.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Cookies</h2>
          <p>
            Nosso site pode utilizar cookies para melhorar a navegação,
            armazenar preferências e analisar o uso da plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            7. Direitos do Usuário
          </h2>
          <p>
            O usuário pode solicitar acesso, correção ou exclusão de seus dados
            pessoais, conforme previsto pela legislação aplicável, incluindo a
            LGPD (Lei Geral de Proteção de Dados).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            8. Alterações nesta Política
          </h2>
          <p>
            Esta Política de Privacidade poderá ser atualizada a qualquer
            momento. Recomendamos que os usuários revisem periodicamente esta
            página.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">9. Contato</h2>
          <p>
            Em caso de dúvidas sobre esta Política de Privacidade, entre em
            contato através da nossa página de contato.
          </p>
        </section>

        <p className="text-sm text-gray-500 pt-4 border-t">
          Última atualização: Junho de 2026.
        </p>
      </div>
    </main>
  );
}

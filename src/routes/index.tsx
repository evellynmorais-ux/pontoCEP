import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main>
      <h1>pontoCEP</h1>
      <p>Consulta de CEP em construção.</p>
    </main>
  );
}

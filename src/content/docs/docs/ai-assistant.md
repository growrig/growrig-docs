---
title: AI assistant
description: A grow-scoped assistant that answers with the context of your environment, powered by a pluggable AI integration.
sidebar:
  order: 8
---

GrowRig includes an optional **AI assistant** — a chat that answers questions
with the context of a specific grow. It is built on the same
[integrations](/docs/integrations/) system as everything else external, so the
model provider is pluggable rather than baked in.

## How it's powered

The assistant consumes the **`ai.chat`** capability (and `ai.vision` for images).
Any integration that provides those capabilities can back it — the seed bundle
is **[Ollama](/integrations/ai/ollama/)**, which runs against a local or hosted
Ollama-compatible API, so conversations can stay entirely on your own hardware.

Because the provider is chosen by a [binding](/docs/integrations/), you can point
the assistant at a local model globally and override it per grow, without the
feature knowing or caring which model answers.

## Grow-scoped conversations

A conversation is **owned by a user and scoped to one grow**. Each chat records
the grow and environment it belongs to, so the assistant can answer with the
relevant cultivation and climate context rather than in a vacuum.

Conversations are **persisted**: they have titles, a running message count, a
preview, and can be archived. Every message is an immutable user or assistant
turn, kept in order — so a chat is a durable record you can return to, not a
throwaway session.

## What it's for

The assistant is a helper layered on top of the grow-domain model — for
interpreting readings, sanity-checking a plan, or answering "what should I look
for at this stage?" It does not command equipment; automation stays with the
[reconciliation engine](/docs/architecture/), whose decisions are always
explainable on their own. Keeping the assistant advisory means an AI provider
being slow, offline, or absent never affects climate control.

## Enabling it

1. Configure an AI [integration instance](/docs/integrations/) (for example,
   Ollama) under **Control panel → Integrations** and confirm its connection
   test passes.
2. Bind the `ai.chat` capability to that instance — globally, or for a specific
   grow.
3. Open a grow and start a conversation.

If no `ai.chat` binding resolves, the assistant is simply unavailable; the rest
of GrowRig is unaffected.

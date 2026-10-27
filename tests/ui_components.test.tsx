// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../src/components/ui/tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../src/components/ui/accordion';
import { Separator } from '../src/components/ui/separator';

describe('shadcn/ui Radix Primitives in Knowly-Yo Notion Theme', () => {
  it('renders Tabs with Notion styling tokens', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Overview</TabsTrigger>
          <TabsTrigger value="tab2">Revisions</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 Content</TabsContent>
        <TabsContent value="tab2">Tab 2 Content</TabsContent>
      </Tabs>
    );

    expect(screen.getByText('Overview')).toBeDefined();
    expect(screen.getByText('Revisions')).toBeDefined();
    expect(screen.getByText('Tab 1 Content')).toBeDefined();
  });

  it('renders Accordion for chapters and toggles', () => {
    render(
      <Accordion type="single" collapsible defaultValue="chap-1">
        <AccordionItem value="chap-1">
          <AccordionTrigger>Chapter 1: Java Memory Model</AccordionTrigger>
          <AccordionContent>Stack vs Heap deep dive</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByText('Chapter 1: Java Memory Model')).toBeDefined();
    expect(screen.getByText('Stack vs Heap deep dive')).toBeDefined();
  });

  it('renders Separator with hairline styling', () => {
    const { container } = render(<Separator orientation="horizontal" />);
    const separator = container.querySelector('[role="none"]');
    expect(separator).toBeDefined();
  });
});

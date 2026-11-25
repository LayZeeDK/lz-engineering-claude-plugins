#!/usr/bin/env bash
# Document's actions branch on this.status both to allow the action and to pick the next status; the tests pass.
set -euo pipefail

mkdir -p src

cat > package.json <<'EOF'
{
  "name": "document",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run"
  }
}
EOF

cat > src/document.ts <<'EOF'
export type Status = 'draft' | 'moderation' | 'published';

export class Document {
  status: Status = 'draft';

  constructor(public readonly isAdmin: boolean) {}

  publish(): void {
    if (this.status === 'draft') {
      this.status = 'moderation';
    } else if (this.status === 'moderation') {
      if (this.isAdmin) {
        this.status = 'published';
      }
    } else if (this.status === 'published') {
      throw new Error('already published');
    }
  }

  reject(): void {
    if (this.status === 'draft') {
      throw new Error('a draft cannot be rejected');
    } else if (this.status === 'moderation') {
      this.status = 'draft';
    } else if (this.status === 'published') {
      this.status = 'draft';
    }
  }

  canEdit(): boolean {
    if (this.status === 'draft') {
      return true;
    } else if (this.status === 'moderation') {
      return this.isAdmin;
    }

    return false;
  }
}
EOF

cat > src/document.test.ts <<'EOF'
import { describe, expect, it } from 'vitest';
import { Document } from './document';

describe('Document', () => {
  it('goes from draft to moderation to published when an admin publishes', () => {
    const document = new Document(true);
    document.publish();
    expect(document.status).toBe('moderation');
    document.publish();
    expect(document.status).toBe('published');
    expect(() => document.publish()).toThrow('already published');
  });

  it('stays in moderation when someone else publishes', () => {
    const document = new Document(false);
    document.publish();
    document.publish();
    expect(document.status).toBe('moderation');
  });

  it('goes back to draft when rejected, and refuses to reject a draft', () => {
    const document = new Document(true);
    expect(() => document.reject()).toThrow('a draft cannot be rejected');
    document.publish();
    document.reject();
    expect(document.status).toBe('draft');
  });

  it('allows editing a draft, and a document in moderation for an admin only', () => {
    const admin = new Document(true);
    const author = new Document(false);
    expect(author.canEdit()).toBe(true);
    admin.publish();
    author.publish();
    expect(admin.canEdit()).toBe(true);
    expect(author.canEdit()).toBe(false);
  });
});
EOF

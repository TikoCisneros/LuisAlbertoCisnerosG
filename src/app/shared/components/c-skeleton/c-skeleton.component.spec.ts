import { render } from '@testing-library/angular';
import { describe, it, expect } from 'vitest';
import { CSkeletonComponent } from './c-skeleton.component';

describe('CSkeletonComponent', () => {
  it('should render with default styles', async () => {
    const { container } = await render(CSkeletonComponent);
    const skeleton = container.querySelector('.c-skeleton') as HTMLElement;
    expect(skeleton).toBeDefined();
    expect(skeleton.style.width).toBe('100%');
    expect(skeleton.style.height).toBe('1rem');
  });

  it('should apply custom width and height inputs', async () => {
    const { container } = await render(CSkeletonComponent, {
      inputs: {
        width: '200px',
        height: '50px',
      },
    });
    const skeleton = container.querySelector('.c-skeleton') as HTMLElement;
    expect(skeleton.style.width).toBe('200px');
    expect(skeleton.style.height).toBe('50px');
  });
});

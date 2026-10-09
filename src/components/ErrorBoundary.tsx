import { Component, type ReactNode } from 'react';
import { t } from '../i18n';
import { navigate } from '../app/router';

export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error('UI error', error);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="page">
        <div className="card stack">
          <h1>{t('error.title')}</h1>
          <p className="muted">{t('error.body')}</p>
          <pre className="subtle" style={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}>
            {this.state.error.message}
          </pre>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => {
              this.setState({ error: null });
              navigate('/', { replace: true });
            }}
          >
            {t('error.home')}
          </button>
        </div>
      </div>
    );
  }
}

module.exports = [
  {
    src_contains: 'name="menu_context_view_serie_details"',
    after_dst_line_contains: 'name="layout_search_no_items"'
  },
  {
    src_contains: 'name="menu_context_view_imdb"',
    after_dst_line_contains: 'name="layout_seasons_no_items"'
  },
  {
    src_contains: 'name="menu_context_view_ep_imdb"',
    after_dst_line_contains: 'name="menu_context_view_imdb"'
  },
  {
    src_contains: /\s+name=["']menu_context_search_on["']/,
    after_dst_line_contains: 'name="menu_context_view_ep_imdb"'
  },
  {
    src_contains: /\s+name=["']menu_context_ext_resources["']/,
    before_dst_line_contains: /\s+name=["']menu_exit["']/
  },
  {
    src_contains: /\s+name=["']menu_context_mark_next_episode_as_seen["']/,
    after_dst_line_contains: /\s+name=["']menu_exit["']/
  }
]

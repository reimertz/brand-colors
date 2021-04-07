/*
* @preserve brand-colors {{ version }}
* http://reimertz.github.io/brand-colors
* (c) 2017 Pierre Reimertz
* may be freely distributed under the MIT license.
*/

{% for company in companies %}
export const {{company.name}} = () => {{company.color}}
{% endfor %}
// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Cisco19RectHandler extends BaseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const {
      builder,
      currentGroup,
      applyShapeAttrsToBuilder,
      x,
      y,
      width,
      height,
      style,
      getStencilShape,
      renderStencilShape,
    } = this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    let d = x;

    let f;
    let g;
    let h;
    let k;
    f = this.getStyleValue(style, 'prIcon', 'l2_switch');
    this.getStyleValue(style, 'fillColor', '#ffffff');
    g = this.getStyleValue(style, 'strokeColor', '#000000');
    h = 'mxgraph.cisco19.bg1';
    k =
      'router csr_1000v wireless_router l3_modular3 ucs_express router_with_voice router_with_firewall netflow_router secure_router ip_telephone_router asr_9000 clock vbond vmanage vsmart vts2'.split(
        ' '
      );
    builder.translate(d, y);
    if (['l2_modular', 'l3_modular', '6500_vss', 'nexus_9500', 'nexus_7k'].includes(f)) {
      h = 'mxgraph.cisco19.bg2';
    } else if (['l2_switch_with_dual_supervisor', 'l3_switch_with_dual_supervisor'].includes(f)) {
      h = 'mxgraph.cisco19.bg3';
    } else if (['l2_modular2'].includes(f)) {
      h = 'mxgraph.cisco19.bg4';
    } else if (['l3_modular2', '6500_vss2', 'hypervisor', 'collab1'].includes(f)) {
      h = 'mxgraph.cisco19.bg5';
    } else if (k.includes(f)) {
      builder.begin();
      if ('wireless_router' == f) {
        builder.ellipse(0, 0.17 * height, width, 0.83 * height);
      } else {
        builder.ellipse(0, 0, width, height);
      }
      builder.fill();
    } else if (
      'content_router;router_with_firewall2;netflow_router2;nam_virtual_service_blade;ucs_5108_blade_chassis;storage;nexus_1kv_vsm;nexus_1k;nexus_1010;dual mode access point;wireless_lan_controller;primary_codec;virtual_desktop_service;video_gateway;video_analytics;telepresence_exchange;meeting_scheduling_and_management_server;content_recording_streaming_server;communications_manager;cisco_unified_presence_service;cisco_unified_contact_center_enterprise_and_hosted;h323;monitor;telepresence_endpoint_twin_data_display;operations_manager;transcoder;contact_center_express;ip_ip_gateway;shield;set_top;da_encoder;ad_encoder;da_decoder;ad_decoder;acs;email_security;vpn_concentrator;ssl_terminator;cisco_security_manager;web_security;nac_appliance;ironport;ips_ids;firewall;asa_5500;flow_collector;load_balancer;web_application_firewall;analysis_correlation;flow_analytics;virtual_private_network2;web_security_services;web_security_services2;virtual_private_network_connector'
        .split(';')
        .includes(f)
    ) {
      h = 'mxgraph.cisco19.bg6';
    } else if (['asr_1000'].includes(f)) {
      h = 'mxgraph.cisco19.bg7';
    } else if (['fibre_channel_director_mds_9000', 'fibre_channel_fabric_switch'].includes(f)) {
      h = 'mxgraph.cisco19.bg8';
    } else if (['ucs_c_series_server'].includes(f)) {
      h = 'mxgraph.cisco19.bg9';
    } else if (['aci'].includes(f) || ['aci2'].includes(f)) {
      d = 'mxgraph.cisco19.acibg';
      this.renderStencilByName(
        d,
        0.195 * width,
        0.195 * height,
        0.61 * width,
        0.61 * height,
        undefined,
        style,
        getStencilShape,
        renderStencilShape
      );
    } else if (['immersive_telepresence_endpoint'].includes(f)) {
      h = 'mxgraph.cisco19.bg10';
    }
    if (!(k.includes(f) || 'aci' == f || 'aci2' == f)) {
      d = h;
      if (null != d) {
        this.renderStencilByName(
          d,
          0,
          0,
          width,
          height,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
      }
    }
    builder.setShadow(!1);
    f = 'mxgraph.cisco19.' + f;
    builder.setFillColor(g as string);
    if (null != f) {
      this.renderStencilByName(
        f,
        0,
        0,
        width,
        height,
        undefined,
        style,
        getStencilShape,
        renderStencilShape
      );
    }
    builder.restore();
  }

  // renderStencilByName is inherited from BaseShapeHandler
}

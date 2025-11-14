import { NumberInput, Button, Icon, CollapsibleSection } from '@mtrifonov-design/pinsandcurves-design';
import React, { useEffect, useState, useSyncExternalStore } from 'react';
import hexToRgb, { rgbToHex } from './hexToRgb';
import LissajousSelectButtonGroup from './LissajousPreview';
import { LISSAJOUS_CURVES, LISSAJOUS_CURVES_MAX_INTEGRAL } from '../../graphics/lissajousCurves';
import PresetButton from './PresetButton';
import presets from '../../graphics/presets';
import SwitchableSection from './SwitchableSection';

export default function Component({
  controls,
}: { controls: Controls }) {


    const state = {
        particleColors: [],
        lissajousParams: LISSAJOUS_CURVES[0],
    }

  const update = (patch: Partial<AdvancedControls>) => {
    const next = { ...state, ...patch };
  };

  const updateColor = (idx: number, value: string) => {
    const colors = state.particleColors.slice();
    colors[idx] = hexToRgb(value) as [number, number, number];
    update({ particleColors: colors });
  };

    const updateBackgroundColor = (value: string) => {
    update({ backgroundColor: hexToRgb(value) });
  };

  const addColor = () => update({ particleColors: [...state.particleColors, [255, 255, 255]] });
  const removeColor = (idx: number) => {
    if (state.particleColors.length === 1) return;
    update({ particleColors: state.particleColors.filter((_, i) => i !== idx) });
  };

  const updateAnimationSpeed = (speed: number, distance: number) => {
    const minSpeed = 0.1;
    const maxFrameLoop = 5000;
    const adj = (1 / minSpeed) * LISSAJOUS_CURVES_MAX_INTEGRAL / maxFrameLoop;

    const loopLength = distance / (speed * adj);
    return Math.floor(loopLength);
  }

  const setPreset = (preset: typeof presets[keyof typeof presets]) => {
    const loopLength = updateAnimationSpeed(preset.animationSpeed, preset.lissajousParams.integral);
    update({
      ...preset,
      loopLifecycle: loopLength,
    });
  
  }


  return (
    <div 
      style={{
        display: 'flex',
        gap: '20px',
        flexDirection: 'column',
        backgroundColor: "var(--gray1)",
        width: '100%',
        height: '100vh',
        padding: '1rem',
        color: 'var(--gray6)',
        overflow: 'scroll',
        scrollbarColor: 'var(--gray3) var(--gray1)',
      }}
    >
      <h2 style={{
        color: 'var(--gray7)',
        fontWeight: "normal",
      }}>
      Liquid Lissajous (Beta)
      </h2>
      <div>
        Version 0.0.5. <a style={{
          color: "var(--continuousBlue3)",
          textDecoration: "underline",
          cursor: "pointer",
        }}
          onClick={() => window.open("https://www.youtube.com/watch?v=ivXyCjc1SoM", "_blank")}
        >Watch tutorial</a>
      </div>
      <hr></hr>
      Pick a preset to get started 
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        alignItems: "center",
        gap: "1rem",
        flexWrap: "wrap",
      }}>
        <PresetButton
          label="Burning Sunset"
          preset={presets.burningSunset}
          onClick={setPreset}
        />
        <PresetButton
          label="Ocean Blues"
          preset={presets.oceanBlues}
          onClick={setPreset}
        />
        <PresetButton
          label="Forest Greens"
          preset={presets.forestGreens}
          onClick={setPreset}
        />
        <PresetButton
          label="Hot Pink"
          preset={presets.hotPink}
          onClick={setPreset}
        />
        <PresetButton
          label="Tropical Disco"
          preset={presets.tropicalDisco}
          onClick={setPreset}
        />
        {/* <PresetButton
          label="Pastel Dream"
          preset={presets.pastelDream}
          onClick={update}
        /> */}

      </div>
      Customize to your liking
        <CollapsibleSection title="General" iconName="settings">
        
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        justifyContent: 'space-between',
      }}>
        canvas size &nbsp;
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <NumberInput
            initialValue={state.width}
            min={100}
            max={1920 * 2}
            step={10}
            onChange={c => update({ width: c })}
          />
          <span>x</span>

          <NumberInput
            initialValue={state.height}
            min={100}
            max={1080 * 2}
            step={10}
            onChange={c => update({ height: c })}
          />
        </div>
      </label>
            <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        justifyContent: 'space-between',
      }}>
        animation speed &nbsp;
        <NumberInput
          initialValue={state.animationSpeed}
          min={0.1}
          max={1}
          step={0.1}
          onChange={c => {
            update({ animationSpeed: c })}}
          onCommit={(c) => {
            
            const loopLength = updateAnimationSpeed(c, state.lissajousParams.integral);
            update({ animationSpeed: c, loopLifecycle: loopLength });
          }}
        />
      </label>
      <SwitchableSection label="export perfect loop" activeOnToggled={false}
          checked={state.exportPerfectLoop}
          onToggle={(checked) => update({ exportPerfectLoop: checked })}
        >
        <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                justifyContent: 'space-between',
              }}>
                export duration (seconds) &nbsp;
                <NumberInput
                  initialValue={state.exportDuration}
                  min={1}
                  max={30}
                  step={1}

                  onCommit={(c) => {
                    update({ exportDuration: c})
                  }}
                />
              </label>
        </SwitchableSection>
      </CollapsibleSection>
      <CollapsibleSection title="Colors" iconName="palette">
      {/* Global limits */}
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        justifyContent: 'space-between',
      }}>
        mixing softness &nbsp;
        <NumberInput
          initialValue={state.mixingIntensity}
          min={0}
          max={1}
          step={0.01}
          onChange={c => update({ mixingIntensity: c })}
        />
      </label>
      {/* Colours */}
      <fieldset
        style={{
          borderColor: 'var(--gray4)',
          borderRadius: 'var(--borderRadiusSmall)',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '0.5rem',
          alignContent: 'center',
        }}
      >
        <legend>particle colours</legend>
        {state.particleColors.map((_, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 4,
            justifyContent: 'center',
            borderRadius: "var(--borderRadiusSmall)",
            border: "1px solid var(--gray3)",
            padding: "0.0rem 0.5rem",
          }}>
            <input
              type="color"
              value={rgbToHex(state.particleColors[i])}
              onChange={e => updateColor(i, e.target.value)}
              style={{
                border: "none",
                backgroundColor: "var(--gray3)",
                borderRadius: "var(--borderRadiusSmall)",
                width: "35px",
                height: "35px",
              }}
            />
            <Icon iconName={"delete"} onClick={() => removeColor(i)} />
          </div>
        ))}
        <Button text={"+ add colour"} onClick={addColor} />
      </fieldset>
      </CollapsibleSection>
      
      {/* Advanced Section Toggle Button */}
      {/* Advanced Section */}
      <CollapsibleSection title="Lissajous Knot" iconName="all_inclusive">
          {/* Show Lissajous Figure Toggle */}
          <div style={{
              display: "flex",
              flexDirection: "row",
              gap: "1rem",
              padding: "1.5rem",
              //border: "1px solid var(--gray3)",
              borderWidth: "2px",
              backgroundColor: "var(--gray2)",
              borderRadius: "var(--borderRadiusSmall)",
              marginBottom: "1rem",
              alignItems: "center",
            }}>
              <div>
                <Icon iconName="info" hoverBgColor='var(--gray2)' color="white"/>
              </div>
              <div>
              <b style={{color: "white"}}>What are Lissajous knots?</b><br></br>
              Lissajous knots are mathematical paths that are defined by equations involving sine and cosine functions.
              They are used here to create complex, looping paths on which color particles can move.
              Feel free to experiment with different parameters to create unique patterns.
              </div>
            </div>
          <div style={{
          }}>
            <SwitchableSection label="display lissajous knot" 
              checked={(state.showLissajousFigure)}
              onToggle={(checked) => update({ showLissajousFigure: checked })}
            >
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}>
            <LissajousSelectButtonGroup
              value={state.lissajousParams}
              options={LISSAJOUS_CURVES.map(curve => ({
                label: `${curve.a}:${curve.b}`,
                value: curve,
              }))}
              onChange={(params) => {
  
                const loopLength = updateAnimationSpeed(state.animationSpeed, params.integral);
                update({ lissajousParams: params, loopLifecycle: loopLength,
                  rotateHorizontal: 0,
                  rotateVertical: 0,
                 });
              }}
          
          />
          <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        justifyContent: 'space-between',
      }}>
        horizontal rotation &nbsp;
        <NumberInput
          initialValue={state.rotateHorizontal}
          min={0}
          max={360}
          step={1}
          onChange={c => {
            update({ rotateHorizontal: c })}}
        />
      </label>
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        justifyContent: 'space-between',
      }}>
        vertical rotation &nbsp;
        <NumberInput
          initialValue={state.rotateVertical}
          min={0}
          max={360}
          step={1}
          onChange={c => {
            update({ rotateVertical: c })}}
        />
      </label>
      </div>
          </SwitchableSection>
          </div>
          

      </CollapsibleSection>
      <CollapsibleSection title="Effects" iconName="star">
      <>
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        justifyContent: 'space-between',
      }}>
        noise intensity &nbsp;
        <NumberInput
          initialValue={state.noiseIntensity}
          min={0}
          max={1}
          step={0.01}
          onChange={c => {
            update({ noiseIntensity: c })}}
        />
      </label>
      </>
      </CollapsibleSection>
    </div>
  );
}
